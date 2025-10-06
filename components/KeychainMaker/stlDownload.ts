// app/components/keychain/stlDownload.ts

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
 * Hook to manage STL download with "all" mode compilation
 */
export function useSTLDownload(
    scadPath: string,
    defines: any,
    compilePart: (scadPath: string, defines: any, mode: string) => Promise<ArrayBuffer>
) {
    const handleDownload = async () => {
        try {
            // Compile with mode="all" to get everything in one mesh
            const buffer = await compilePart(scadPath, defines, 'all');

            if (!buffer || buffer.byteLength === 0) {
                console.warn('No STL data generated');
                return;
            }

            downloadSTL(buffer, 'keychain.stl');
        } catch (error) {
            console.error('Failed to download STL:', error);
        }
    };

    return { handleDownload };
}