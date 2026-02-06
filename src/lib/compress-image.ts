"use client";

/**
 * Compresses an image file to reduce size for upload.
 * Converts to JPEG with quality reduction and resizes if needed.
 * Target: max 800KB, max 1200px on longest side.
 */
export async function compressImage(file: File): Promise<File> {
    // If already small enough, return as-is
    if (file.size < 500 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            try {
                // Calculate new dimensions (max 1200px on longest side)
                let { width, height } = img;
                const maxSize = 1200;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Failed to compress image"));
                            return;
                        }

                        // Create new file with compressed data
                        const compressedFile = new File(
                            [blob],
                            file.name.replace(/\.[^.]+$/, ".jpg"),
                            { type: "image/jpeg" }
                        );

                        console.log(
                            `Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB`
                        );

                        resolve(compressedFile);
                    },
                    "image/jpeg",
                    0.8 // 80% quality
                );
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = () => reject(new Error("Failed to load image"));

        // Load image from file
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}
