import { NextResponse } from 'next/server';

export async function GET(request: { url: string | URL; }) {
    try {
        const { searchParams } = new URL(request.url);
        const modelUrl = searchParams.get('url');

        if (!modelUrl) {
            return NextResponse.json(
                { error: 'Model URL is required' },
                { status: 400 }
            );
        }

        // Validate that it's a Meshy URL for security
        if (!modelUrl.includes('assets.meshy.ai')) {
            return NextResponse.json(
                { error: 'Invalid model URL' },
                { status: 400 }
            );
        }

        console.log('Fetching model file from:', modelUrl);

        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            // Fetch the model file from Meshy with timeout
            const response = await fetch(modelUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/octet-stream, model/gltf-binary, model/obj, model/fbx, */*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error('Failed to fetch model file:', response.status, response.statusText);
                return NextResponse.json(
                    { error: `Failed to fetch model file: ${response.statusText}` },
                    { status: response.status }
                );
            }

            // Get the binary data
            const arrayBuffer = await response.arrayBuffer();

            // Determine content type based on URL extension
            let contentType = 'application/octet-stream';
            if (modelUrl.includes('.glb')) {
                contentType = 'model/gltf-binary';
            } else if (modelUrl.includes('.obj')) {
                contentType = 'model/obj';
            } else if (modelUrl.includes('.fbx')) {
                contentType = 'model/fbx';
            } else if (modelUrl.includes('.stl')) {
                contentType = 'model/stl';
            } else if (modelUrl.includes('.usdz')) {
                contentType = 'model/usd';
            }

            // Return the model file with proper headers
            return new NextResponse(arrayBuffer, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': arrayBuffer.byteLength.toString(),
                    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        } catch (fetchError) {
            clearTimeout(timeoutId);

            // @ts-ignore
            if (fetchError.name === 'AbortError') {
                console.error('Model fetch timeout after 30 seconds');
                return NextResponse.json(
                    { error: 'Request timeout - Model file took too long to download' },
                    { status: 408 }
                );
            }

            throw fetchError; // Re-throw other errors to be caught by outer catch
        }

    } catch (error) {
        console.error('Proxy model error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy model file' },
            { status: 500 }
        );
    }
}