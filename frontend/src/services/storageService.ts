import type { VideoDetails } from "../types/services/storageService";

class StorageService {
    private db: IDBDatabase | null = null;

    constructor() {
        const request = indexedDB.open("videosDB", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("videos")) {
                db.createObjectStore("videos", { keyPath: "url" });
            }
        };

        request.onsuccess = (event) => {
            this.db = (event.target as IDBOpenDBRequest).result;
            console.log("IndexedDB initialized");
        };

        request.onerror = () => console.error("IndexedDB initialization failed");
    }

    // Helper to await IDBRequest
    private async request<T>(req: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async saveFile(file: File): Promise<VideoDetails> {
        if (!this.db) throw new Error("DB not initialized");

        const url = file.name.replace(/\s+/g, "");

        const video: VideoDetails = {
            name: file.name,
            url,
            size: file.size,
            type: file.type,
            blob: file,
            metadata: null,
        };

        const tx = this.db.transaction("videos", "readwrite");
        const store = tx.objectStore("videos");
        await this.request(store.put(video));

        return video;
    }

    async getFile(url: string): Promise<VideoDetails | null> {
        if (!this.db) throw new Error("DB not initialized");

        const tx = this.db.transaction("videos", "readonly");
        const store = tx.objectStore("videos");
        return (await this.request(store.get(url))) || null;
    }

    async getAllFiles(): Promise<VideoDetails[]> {
        if (!this.db) throw new Error("DB not initialized");

        const tx = this.db.transaction("videos", "readonly");
        const store = tx.objectStore("videos");
        return await this.request(store.getAll());
    }

    async deleteFile(url: string): Promise<void> {
        if (!this.db) throw new Error("DB not initialized");

        const tx = this.db.transaction("videos", "readwrite");
        const store = tx.objectStore("videos");
        await this.request(store.delete(url));
    }
}

export default new StorageService();