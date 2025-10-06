// app/components/keychain/woocommerceIntegration.ts

/**
 * Triggers download of an ArrayBuffer as a file
 */
export function downloadSTL(buffer: ArrayBuffer, filename: string = 'keychain.stl') {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Generate unique filename based on design parameters
 */
function generateFilename(defines: any): string {
    const timestamp = Date.now();
    const line1 = (defines.linea1 || 'keychain').replace(/[^a-zA-Z0-9]/g, '-');
    return `keychain-${line1}-${timestamp}.stl`;
}

/**
 * Add STL to WooCommerce cart with custom field
 */
async function addToWooCommerceCart(
    productId: number,
    stlBuffer: ArrayBuffer,
    filename: string,
    wooApiUrl: string
): Promise<boolean> {
    try {
        const base64Data = arrayBufferToBase64(stlBuffer);

        // Create FormData with the STL file and product info
        const formData = new FormData();
        const blob = new Blob([stlBuffer], { type: 'application/octet-stream' });
        formData.append('stl_file', blob, filename);
        formData.append('product_id', productId.toString());
        formData.append('quantity', '1');

        // Add custom field data for Product Custom Field Pro
        formData.append('custom_fields[stl_design_file]', base64Data);
        formData.append('custom_fields[stl_filename]', filename);

        // Send to your WordPress/WooCommerce endpoint
        const response = await fetch(wooApiUrl, {
            method: 'POST',
            body: formData,
            credentials: 'include', // Include cookies for WooCommerce session
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || false;
    } catch (error) {
        console.error('Failed to add to cart:', error);
        return false;
    }
}

/**
 * Hook to manage WooCommerce integration
 */
export function useWooCommerceCart(
    scadPath: string,
    defines: any,
    compilePart: (scadPath: string, defines: any, mode: string) => Promise<ArrayBuffer>,
    config: {
        productId: number;
        apiUrl: string;
        onSuccess?: () => void;
        onError?: (error: string) => void;
    }
) {
    const handleAddToCart = async () => {
        try {
            // Compile with mode="all" to get complete keychain
            const buffer = await compilePart(scadPath, defines, 'all');

            if (!buffer || buffer.byteLength === 0) {
                config.onError?.('Failed to generate STL file');
                return;
            }

            const filename = generateFilename(defines);

            // Add to WooCommerce cart
            const success = await addToWooCommerceCart(
                config.productId,
                buffer,
                filename,
                config.apiUrl
            );

            if (success) {
                config.onSuccess?.();
            } else {
                config.onError?.('Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            config.onError?.('An error occurred. Please try again.');
        }
    };

    const handleDownload = async () => {
        try {
            const buffer = await compilePart(scadPath, defines, 'all');

            if (!buffer || buffer.byteLength === 0) {
                console.warn('No STL data generated');
                return;
            }

            const filename = generateFilename(defines);
            downloadSTL(buffer, filename);
        } catch (error) {
            console.error('Failed to download STL:', error);
        }
    };

    return { handleAddToCart, handleDownload };
}