import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Ładowanie zmiennych środowiskowych
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint do tłumaczeń
app.post('/api/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

    if (!text || !targetLang) {
        return res.status(400).json({ 
            error: 'Brak wymaganych parametrów',
            details: 'Wymagane parametry: text i targetLang'
        });
    }

    if (!DEEPL_API_KEY) {
        return res.status(500).json({ 
            error: 'Brak klucza API DeepL',
            details: 'Dodaj DEEPL_API_KEY do pliku .env'
        });
    }

    try {
        console.log('Wysyłanie żądania do DeepL:', { text, targetLang });
        
        const response = await fetch(DEEPL_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [text],
                target_lang: targetLang,
                source_lang: 'PL',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Odpowiedź z DeepL:', data);
            throw new Error(data.message || `Błąd API DeepL: ${response.statusText}`);
        }
        
        if (!data.translations || data.translations.length === 0) {
            throw new Error('Brak tłumaczenia z DeepL');
        }

        console.log('Tłumaczenie udane:', data.translations[0].text);
        
        return res.status(200).json({
            translatedText: data.translations[0].text
        });
    } catch (error) {
        console.error('Błąd tłumaczenia:', error);
        return res.status(500).json({ 
            error: 'Błąd tłumaczenia',
            details: error.message
        });
    }
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer API działa na porcie ${port}`);
    console.log('Klucz API DeepL:', process.env.DEEPL_API_KEY ? 'Ustawiony' : 'Brak');
}); 