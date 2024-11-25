export type Rotation = 0 | 90 | 180 | 270;

export type PillPosition = 'horizontal' | 'vertical' | 'verticalFlipped';

export type Color = 'hotpink' | 'yellow' | 'dodgerblue';

export interface MatrixItem {
    type: 'pill' | 'virus',
    color: Color,
    id: string,
    row: number,
    column: number
}

export interface Virus extends MatrixItem {
    type: 'virus',
}

export interface Pill extends MatrixItem {
    type: 'pill',
    border: string
}

export type Matrix = Array<Array<MatrixItem | null>>;