import { WebflowApiClient, WebflowAsset } from './webflowApi';

const emojiMap = {
  smile: "😊",
  wink: "😉",
  heart: "😍",
  cry: "😭",
};

// State management
let selectedEmoji = emojiMap.smile;
let assets: WebflowAsset[] = [];
let webflowApi: WebflowApiClient;

// Initialize the application
function init() {
  // Initialize table functionality
  initializeTableFunctionality();
}

function initializeTableFunctionality() {
  const tableRows = document.querySelectorAll<HTMLTableRowElement>('#emoji-details-table tbody tr');
  const keywordFilter = document.getElementById('keyword-filter') as HTMLInputElement;
  const typeFilter = document.getElementById('type-filter') as HTMLSelectElement;

  // Initialize keyboard navigation for alt text inputs
  document.querySelectorAll<HTMLInputElement>('#emoji-details-table input[type="text"]').forEach(input => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const currentRow = input.closest('tr');
        if (!currentRow) return;

        // Find the next row with an enabled input
        let nextRow = currentRow.nextElementSibling as HTMLTableRowElement;
        while (nextRow) {
          if (nextRow.style.display !== 'none') {
            const nextInput = nextRow.querySelector<HTMLInputElement>('input[type="text"]');
            if (nextInput && !nextInput.disabled) {
              nextInput.focus();
              break;
            }
          }
          nextRow = nextRow.nextElementSibling as HTMLTableRowElement;
        }
      }
    });
  });

  // Set default view to 'Action Required'
  showActionRequiredView();

  // Initialize toggle switches
  document.querySelectorAll<HTMLElement>('.toggle-input').forEach(toggle => {
    toggle.addEventListener('click', async function(this: HTMLElement) {
      const isChecked = this.classList.toggle('checked');
      this.dataset.type = isChecked ? 'decorative' : 'meaningful';
      
      // Handle alt text field state
      const row = this.closest('tr');
      if (row) {
        const altTextField = row.querySelector<HTMLInputElement>('input[type="text"]');
        if (altTextField) {
          altTextField.disabled = isChecked; // Disable if decorative
          if (isChecked) {
            altTextField.value = ''; // Clear alt text if decorative
            altTextField.placeholder = 'No alt text needed (decorative image)';
          } else {
            altTextField.placeholder = 'Enter alt text';
          }
        }
      }

      // Refresh the current view
      if (document.getElementById('action-required-view')?.classList.contains('active')) {
        await showActionRequiredView();
      } else {
        await showAllImagesView();
      }
    });
  });

  // Helper functions
  async function hideRow(row: HTMLTableRowElement) {
    row.classList.add('fade-out');
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for animation
    row.style.display = 'none';
    row.classList.remove('fade-out');
  }

  async function showRow(row: HTMLTableRowElement) {
    row.style.opacity = '0';
    row.style.display = '';
    await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for display to take effect
    row.style.opacity = '1';
    row.style.transition = 'opacity 0.3s ease-in';
  }

  async function showActionRequiredView() {
    const promises: Promise<void>[] = [];
    tableRows.forEach((row: HTMLTableRowElement) => {
      const altText = row.querySelector<HTMLInputElement>('input[type="text"]')?.value || '';
      const type = row.querySelector<HTMLElement>('.toggle-input')?.dataset.type || '';
      
      // Show only meaningful images without alt text
      const isVisible = type === 'meaningful' && altText.trim() === '';
      if (isVisible) {
        promises.push(showRow(row));
      } else {
        promises.push(hideRow(row));
      }
    });
    await Promise.all(promises);
  }

  async function showAllImagesView() {
    const selectedType = typeFilter?.value;
    const promises: Promise<void>[] = [];
    tableRows.forEach((row: HTMLTableRowElement) => {
      const type = row.querySelector<HTMLElement>('.toggle-input')?.dataset.type || '';
      
      let isVisible = true;
      if (selectedType === 'meaningful') {
        isVisible = type === 'meaningful';
      } else if (selectedType === 'decorative') {
        isVisible = type === 'decorative';
      }
      
      if (isVisible) {
        promises.push(showRow(row));
      } else {
        promises.push(hideRow(row));
      }
    });
    await Promise.all(promises);
  }

  async function filterTable() {
    const keyword = keywordFilter?.value.toLowerCase() || '';
    const selectedType = typeFilter?.value;
    const isActionRequired = document.getElementById('action-required-view')?.classList.contains('active');

    const promises: Promise<void>[] = [];
    tableRows.forEach((row: HTMLTableRowElement) => {
      const fileName = row.querySelector('td:nth-child(5)')?.textContent?.toLowerCase() || '';
      const altText = (row.querySelector('input[type="text"]') as HTMLInputElement)?.value.toLowerCase() || '';
      const type = row.querySelector<HTMLElement>('.toggle-input')?.dataset.type || '';

      let isVisible = true;

      // Handle keyword filter
      const matchesKeyword = fileName.includes(keyword) || altText.includes(keyword);
      if (!matchesKeyword) {
        isVisible = false;
      }

      // Handle type filter
      if (selectedType === 'meaningful' && type !== 'meaningful') {
        isVisible = false;
      } else if (selectedType === 'decorative' && type !== 'decorative') {
        isVisible = false;
      }

      // Handle action required view
      if (isActionRequired && (type !== 'meaningful' || altText.trim() !== '')) {
        isVisible = false;
      }

      if (isVisible) {
        promises.push(showRow(row));
      } else {
        promises.push(hideRow(row));
      }
    });
    await Promise.all(promises);
  }

  // Initialize copy and open buttons
  document.querySelectorAll('.copy-url').forEach(button => {
    button.addEventListener('click', async function(this: HTMLElement) {
      const row = this.closest('tr');
      if (row) {
        const img = row.querySelector('img');
        if (img) {
          try {
            await navigator.clipboard.writeText(img.src);
            
            // Show success state
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.classList.add('success');

            // Reset after 2 seconds
            setTimeout(() => {
              this.textContent = originalText;
              this.classList.remove('success');
            }, 2000);
          } catch (error) {
            console.error('Failed to copy URL:', error);
          }
        }
      }
    });
  });

  document.querySelectorAll('.open-url').forEach(button => {
    button.addEventListener('click', function(this: HTMLElement) {
      const row = this.closest('tr');
      if (row) {
        const img = row.querySelector('img');
        if (img) {
          window.open(img.src, '_blank');
        }
      }
    });
  });

  // Keyword filter
  keywordFilter?.addEventListener('input', async () => {
    await filterTable();
  });

  // Type filter
  typeFilter?.addEventListener('change', async () => {
    await filterTable();
  });

  // Sort functionality
  document.querySelectorAll<HTMLElement>('.sortable').forEach(header => {
    header.addEventListener('click', function(this: HTMLElement) {
      const column = this.dataset.column;
      if (!column) return;

      // Toggle sort direction
      const currentDirection = this.dataset.direction || 'asc';
      const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      this.dataset.direction = newDirection;

      sortTable(column, newDirection);
    });
  });

  function sortTable(column: string, direction: 'asc' | 'desc') {
    const tbody = document.querySelector<HTMLTableSectionElement>('#emoji-details-table tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.rows);

    rows.sort((a: HTMLTableRowElement, b: HTMLTableRowElement) => {
      let valueA = '';
      let valueB = '';

      switch (column) {
        case 'altText':
          valueA = (a.querySelector('input[type="text"]') as HTMLInputElement)?.value || '';
          valueB = (b.querySelector('input[type="text"]') as HTMLInputElement)?.value || '';
          break;
        case 'type':
          valueA = a.querySelector<HTMLElement>('.toggle-input')?.dataset.type || '';
          valueB = b.querySelector<HTMLElement>('.toggle-input')?.dataset.type || '';
          break;
        case 'fileName':
          valueA = a.querySelector('td:nth-child(5)')?.textContent || '';
          valueB = b.querySelector('td:nth-child(5)')?.textContent || '';
          break;
        case 'dateAdded':
          valueA = a.querySelector('td:nth-child(6)')?.textContent || '';
          valueB = b.querySelector('td:nth-child(6)')?.textContent || '';
          break;
      }

      const comparison = valueA.localeCompare(valueB);
      return direction === 'asc' ? comparison : -comparison;
    });

    rows.forEach(row => tbody.appendChild(row));
  }

  // Initialize view buttons
  const actionRequiredBtn = document.getElementById('action-required-view');
  const allImagesBtn = document.getElementById('all-images-view');

  actionRequiredBtn?.addEventListener('click', async () => {
    actionRequiredBtn.classList.add('active');
    allImagesBtn?.classList.remove('active');
    await showActionRequiredView();
  });

  allImagesBtn?.addEventListener('click', async () => {
    allImagesBtn.classList.add('active');
    actionRequiredBtn?.classList.remove('active');
    await showAllImagesView();
  });

  // Set initial state and focus
  actionRequiredBtn?.click(); // Start with Action Required view

  // Set initial sort by file name
  const fileNameHeader = document.querySelector<HTMLElement>('.sortable[data-column="fileName"]');
  if (fileNameHeader) {
    fileNameHeader.dataset.direction = 'asc';
    sortTable('fileName', 'asc');
  }

  // Focus the first visible input field after initial view and sort
  setTimeout(() => {
    const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
    const firstVisibleInput = visibleRows[0]?.querySelector<HTMLInputElement>('input[type="text"]');
    if (firstVisibleInput && !firstVisibleInput.disabled) {
      firstVisibleInput.focus();
    }
  }, 350); // Wait for animations to complete
}

// Start the application
init();
