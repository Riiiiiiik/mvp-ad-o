import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { Property } from '../types/property';

export function useProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = useCallback(async (options?: {
        searchTerm?: string,
        type?: string,
        highlightedOnly?: boolean,
        status?: string
    }) => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from('properties')
                .select('*, images:property_images(*)')
                .order('created_at', { ascending: false });

            if (options?.searchTerm) {
                query = query.or(`titulo.ilike.%${options.searchTerm}%,localizacao.ilike.%${options.searchTerm}%`);
            }

            if (options?.status) {
                query = query.eq('status', options.status);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            let filtered = data || [];
            if (options?.type && options.type !== 'Tipo de imóvel' && options.type !== 'Ver Todos') {
                filtered = filtered.filter((p: Property) => p.tipo === options.type);
            }

            if (options?.highlightedOnly) {
                filtered = filtered.filter((p: Property) => p.is_destaque === 1);
            }

            setProperties(filtered);
        } catch (err: any) {
            console.error('Error fetching properties:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { properties, loading, error, fetchProperties };
}
