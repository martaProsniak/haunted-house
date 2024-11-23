export type Rotation = 0 | 90 | 180 | 270;

export type PillPosition = 'horizontal' | 'vertical' | 'verticalFlipped';

export type Color = 'hotpink' | 'yellow' | 'dodgerblue';

export interface MatrixItem {
    type: 'pill-single' | 'pill-double' | 'virus',
    color: Color,
    id: string,
}

export interface Virus extends MatrixItem {
    type: 'virus',
    row: number,
    column: number
}

export interface Pill extends MatrixItem {
    type: 'pill-single' | 'pill-double',
    row: number,
    column: number,
    border: string
}