export interface ReadingPreferences {
    fontSize: number;
    fontFamily: string;
    lineSpacing: number;
    theme: string;
}

export interface CreateReadingPreferences extends ReadingPreferences {
    accountId: string;
}