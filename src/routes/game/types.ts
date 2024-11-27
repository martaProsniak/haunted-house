export type Rotation = 0 | 90 | 180 | 270;

export type PillPosition = 'horizontal' | 'vertical' | 'verticalFlipped';

export type Color = 'pink' | 'green' | 'blue';

export interface MatrixItem {
    type: 'pill' | 'ghost',
    color: Color,
    id: string,
    row: number,
    column: number
}

export interface Ghost extends MatrixItem {
    type: 'ghost',
    imageUrl: string
}

export interface Pill extends MatrixItem {
    type: 'pill',
    border: string
}

export type Matrix = Array<Array<MatrixItem | null>>;