// file-preview.model.ts
export interface Folder {
    _id: string;
    user: string;
    name: string;
    isSpecial: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Owner {
    _id: string;
    name: string;
    email: string;
    phone: number;
    password: string;
    emailConfirmed: boolean;
    mfaEnabled: boolean;
    mfaMethod: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    tokens: Array<{ token: string, _id: string }>;
}

export interface FilePreview {
    _id: string;
    filename: string;
    originalName: string;
    path: string;
    size: number;
    sharedWith: string[];
    version: number;
    folderId: Folder;
    ownerId: Owner;
    isDeleted: boolean;
    thumbnails: string[];
    encrypted: boolean;
    offlineAccess: boolean;
    location: string;
    uploadedAt: string;
    __v: number;
}
