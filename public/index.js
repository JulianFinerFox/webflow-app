var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const emojiMap = {
    smile: "😊",
    wink: "😉",
    heart: "😍",
    cry: "😭",
};
// State management
let selectedEmoji = emojiMap.smile;
let assets = [];
let webflowApi;
// Initialize the application
function init() {
    // Initialize table functionality
    initializeTableFunctionality();
}
function initializeTableFunctionality() {
    const tableRows = document.querySelectorAll('#emoji-details-table tbody tr');
    const keywordFilter = document.getElementById('keyword-filter');
    const typeFilter = document.getElementById('type-filter');
    // Initialize keyboard navigation for alt text inputs
    document.querySelectorAll('#emoji-details-table input[type="text"]').forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const currentRow = input.closest('tr');
                if (!currentRow)
                    return;
                // Find the next row with an enabled input
                let nextRow = currentRow.nextElementSibling;
                while (nextRow) {
                    if (nextRow.style.display !== 'none') {
                        const nextInput = nextRow.querySelector('input[type="text"]');
                        if (nextInput && !nextInput.disabled) {
                            nextInput.focus();
                            break;
                        }
                    }
                    nextRow = nextRow.nextElementSibling;
                }
            }
        });
    });
    // Set default view to 'Action Required'
    showActionRequiredView();
    // Initialize toggle switches
    document.querySelectorAll('.toggle-input').forEach(toggle => {
        toggle.addEventListener('click', function () {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const isChecked = this.classList.toggle('checked');
                this.dataset.type = isChecked ? 'decorative' : 'meaningful';
                // Handle alt text field state
                const row = this.closest('tr');
                if (row) {
                    const altTextField = row.querySelector('input[type="text"]');
                    if (altTextField) {
                        altTextField.disabled = isChecked; // Disable if decorative
                        if (isChecked) {
                            altTextField.value = ''; // Clear alt text if decorative
                            altTextField.placeholder = 'No alt text needed (decorative image)';
                        }
                        else {
                            altTextField.placeholder = 'Enter alt text';
                        }
                    }
                }
                // Refresh the current view
                if ((_a = document.getElementById('action-required-view')) === null || _a === void 0 ? void 0 : _a.classList.contains('active')) {
                    yield showActionRequiredView();
                }
                else {
                    yield showAllImagesView();
                }
            });
        });
    });
    // Helper functions
    function hideRow(row) {
        return __awaiter(this, void 0, void 0, function* () {
            row.classList.add('fade-out');
            yield new Promise(resolve => setTimeout(resolve, 300)); // Wait for animation
            row.style.display = 'none';
            row.classList.remove('fade-out');
        });
    }
    function showRow(row) {
        return __awaiter(this, void 0, void 0, function* () {
            row.style.opacity = '0';
            row.style.display = '';
            yield new Promise(resolve => setTimeout(resolve, 50)); // Small delay for display to take effect
            row.style.opacity = '1';
            row.style.transition = 'opacity 0.3s ease-in';
        });
    }
    function showActionRequiredView() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            tableRows.forEach((row) => {
                var _a, _b;
                const altText = ((_a = row.querySelector('input[type="text"]')) === null || _a === void 0 ? void 0 : _a.value) || '';
                const type = ((_b = row.querySelector('.toggle-input')) === null || _b === void 0 ? void 0 : _b.dataset.type) || '';
                // Show only meaningful images without alt text
                const isVisible = type === 'meaningful' && altText.trim() === '';
                if (isVisible) {
                    promises.push(showRow(row));
                }
                else {
                    promises.push(hideRow(row));
                }
            });
            yield Promise.all(promises);
        });
    }
    function showAllImagesView() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedType = typeFilter === null || typeFilter === void 0 ? void 0 : typeFilter.value;
            const promises = [];
            tableRows.forEach((row) => {
                var _a;
                const type = ((_a = row.querySelector('.toggle-input')) === null || _a === void 0 ? void 0 : _a.dataset.type) || '';
                let isVisible = true;
                if (selectedType === 'meaningful') {
                    isVisible = type === 'meaningful';
                }
                else if (selectedType === 'decorative') {
                    isVisible = type === 'decorative';
                }
                if (isVisible) {
                    promises.push(showRow(row));
                }
                else {
                    promises.push(hideRow(row));
                }
            });
            yield Promise.all(promises);
        });
    }
    function filterTable() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const keyword = (keywordFilter === null || keywordFilter === void 0 ? void 0 : keywordFilter.value.toLowerCase()) || '';
            const selectedType = typeFilter === null || typeFilter === void 0 ? void 0 : typeFilter.value;
            const isActionRequired = (_a = document.getElementById('action-required-view')) === null || _a === void 0 ? void 0 : _a.classList.contains('active');
            const promises = [];
            tableRows.forEach((row) => {
                var _a, _b, _c, _d;
                const fileName = ((_b = (_a = row.querySelector('td:nth-child(5)')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
                const altText = ((_c = row.querySelector('input[type="text"]')) === null || _c === void 0 ? void 0 : _c.value.toLowerCase()) || '';
                const type = ((_d = row.querySelector('.toggle-input')) === null || _d === void 0 ? void 0 : _d.dataset.type) || '';
                let isVisible = true;
                // Handle keyword filter
                const matchesKeyword = fileName.includes(keyword) || altText.includes(keyword);
                if (!matchesKeyword) {
                    isVisible = false;
                }
                // Handle type filter
                if (selectedType === 'meaningful' && type !== 'meaningful') {
                    isVisible = false;
                }
                else if (selectedType === 'decorative' && type !== 'decorative') {
                    isVisible = false;
                }
                // Handle action required view
                if (isActionRequired && (type !== 'meaningful' || altText.trim() !== '')) {
                    isVisible = false;
                }
                if (isVisible) {
                    promises.push(showRow(row));
                }
                else {
                    promises.push(hideRow(row));
                }
            });
            yield Promise.all(promises);
        });
    }
    // Initialize copy and open buttons
    document.querySelectorAll('.copy-url').forEach(button => {
        button.addEventListener('click', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const row = this.closest('tr');
                if (row) {
                    const img = row.querySelector('img');
                    if (img) {
                        try {
                            yield navigator.clipboard.writeText(img.src);
                            // Show success state
                            const originalText = this.textContent;
                            this.textContent = 'Copied!';
                            this.classList.add('success');
                            // Reset after 2 seconds
                            setTimeout(() => {
                                this.textContent = originalText;
                                this.classList.remove('success');
                            }, 2000);
                        }
                        catch (error) {
                            console.error('Failed to copy URL:', error);
                        }
                    }
                }
            });
        });
    });
    document.querySelectorAll('.open-url').forEach(button => {
        button.addEventListener('click', function () {
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
    keywordFilter === null || keywordFilter === void 0 ? void 0 : keywordFilter.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        yield filterTable();
    }));
    // Type filter
    typeFilter === null || typeFilter === void 0 ? void 0 : typeFilter.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
        yield filterTable();
    }));
    // Sort functionality
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', function () {
            const column = this.dataset.column;
            if (!column)
                return;
            // Toggle sort direction
            const currentDirection = this.dataset.direction || 'asc';
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
            this.dataset.direction = newDirection;
            sortTable(column, newDirection);
        });
    });
    function sortTable(column, direction) {
        const tbody = document.querySelector('#emoji-details-table tbody');
        if (!tbody)
            return;
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            let valueA = '';
            let valueB = '';
            switch (column) {
                case 'altText':
                    valueA = ((_a = a.querySelector('input[type="text"]')) === null || _a === void 0 ? void 0 : _a.value) || '';
                    valueB = ((_b = b.querySelector('input[type="text"]')) === null || _b === void 0 ? void 0 : _b.value) || '';
                    break;
                case 'type':
                    valueA = ((_c = a.querySelector('.toggle-input')) === null || _c === void 0 ? void 0 : _c.dataset.type) || '';
                    valueB = ((_d = b.querySelector('.toggle-input')) === null || _d === void 0 ? void 0 : _d.dataset.type) || '';
                    break;
                case 'fileName':
                    valueA = ((_e = a.querySelector('td:nth-child(5)')) === null || _e === void 0 ? void 0 : _e.textContent) || '';
                    valueB = ((_f = b.querySelector('td:nth-child(5)')) === null || _f === void 0 ? void 0 : _f.textContent) || '';
                    break;
                case 'dateAdded':
                    valueA = ((_g = a.querySelector('td:nth-child(6)')) === null || _g === void 0 ? void 0 : _g.textContent) || '';
                    valueB = ((_h = b.querySelector('td:nth-child(6)')) === null || _h === void 0 ? void 0 : _h.textContent) || '';
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
    actionRequiredBtn === null || actionRequiredBtn === void 0 ? void 0 : actionRequiredBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        actionRequiredBtn.classList.add('active');
        allImagesBtn === null || allImagesBtn === void 0 ? void 0 : allImagesBtn.classList.remove('active');
        yield showActionRequiredView();
    }));
    allImagesBtn === null || allImagesBtn === void 0 ? void 0 : allImagesBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        allImagesBtn.classList.add('active');
        actionRequiredBtn === null || actionRequiredBtn === void 0 ? void 0 : actionRequiredBtn.classList.remove('active');
        yield showAllImagesView();
    }));
    // Set initial state and focus
    actionRequiredBtn === null || actionRequiredBtn === void 0 ? void 0 : actionRequiredBtn.click(); // Start with Action Required view
    // Set initial sort by file name
    const fileNameHeader = document.querySelector('.sortable[data-column="fileName"]');
    if (fileNameHeader) {
        fileNameHeader.dataset.direction = 'asc';
        sortTable('fileName', 'asc');
    }
    // Focus the first visible input field after initial view and sort
    setTimeout(() => {
        var _a;
        const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
        const firstVisibleInput = (_a = visibleRows[0]) === null || _a === void 0 ? void 0 : _a.querySelector('input[type="text"]');
        if (firstVisibleInput && !firstVisibleInput.disabled) {
            firstVisibleInput.focus();
        }
    }, 350); // Wait for animations to complete
}
// Start the application
init();
export {};
