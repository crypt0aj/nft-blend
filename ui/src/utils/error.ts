export const errorMessageBoundary = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === 'string') {
        return err;
    }
    if (err?.toString) {
        return err.toString();
    }

    console.error(err);
    return '';
}

export const errorBoundary = (err: unknown): NodeJSError => {
    if (err instanceof Error) {
        return err;
    }
    if (typeof err === 'string') {
        return new Error(err);
    }
    if (err?.toString) {
        return new Error(err.toString());
    }
    console.error(err);
    return new Error('');
}

export interface NodeJSError extends Error {
    name: string
    message: string
    stack?: string
    code?: number | string
}