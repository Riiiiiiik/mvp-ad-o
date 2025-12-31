export interface PropertyImage {
    id?: number;
    image_url: string;
    thumb_url?: string;
    ordem?: number;
}

export interface Property {
    id: number;
    titulo: string;
    descricao?: string;
    preco?: string;
    condominio?: string;
    iptu?: string;
    localizacao?: string;
    tipo?: string;
    quartos?: number;
    banheiros?: number;
    vagas?: number;
    area?: string;
    status: string;
    video_url?: string;
    main_image_url?: string;
    thumb_image_url?: string;
    is_destaque: number;
    views_count?: number;
    images?: PropertyImage[];
    created_at?: string;
}

export type PropertyStatus = 'ATIVO' | 'RESERVADO' | 'VENDIDO' | 'INATIVO';
export type PropertyType = 'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Comercial' | 'Apto' | 'LOTE';
