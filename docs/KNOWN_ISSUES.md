# Known Issues

## TypeScript Type Definitions

### Issue with Webflow Designer Extension API Types
Currently, there are some mismatches between the TypeScript type definitions and the actual Webflow Designer Extension API. This affects the following functionality:

1. Setting image properties on elements
2. Updating element content
3. Manipulating DOM elements within the Webflow designer

### Temporary Workaround
Until these type definition issues are resolved, we're using type assertions to bypass the TypeScript errors. This is not ideal but allows the code to function while maintaining type safety in other areas.

### Future Improvements
We are tracking these type definition issues and will update the code once:
1. Updated type definitions are available from `@webflow/designer-extension-typings`
2. We receive clarification on the correct API methods to use
3. We find a better solution that maintains type safety

## Asset Integration

### Current Limitations
1. The asset selection is currently limited to the first available asset
2. There's no UI for selecting specific assets
3. The fallback to emojis might not be ideal for all use cases

### Planned Improvements
1. Add asset selection UI
2. Implement asset search and filtering
3. Improve the fallback mechanism
4. Add better error handling for asset loading 