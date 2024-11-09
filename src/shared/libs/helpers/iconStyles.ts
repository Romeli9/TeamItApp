import {Colors} from './colors';

interface IIconStyle {
  extraSmall: IconStyle;
  small: IconStyle;
  medium: IconStyle;
  large: IconStyle;
}

class IconStyle {
  constructor(width: number, height: number, color: Colors) {
    this.width = width;
    this.height = height;
    this.color = color;
  }

  width: number;
  height: number;
  color: Colors;

  changeColor(color: Colors) {
    return new IconStyle(this.width, this.height, color);
  }
}

export const IconStyles: IIconStyle = {
  extraSmall: new IconStyle(12, 12, Colors.Gray300),
  small: new IconStyle(16, 16, Colors.Gray300),
  medium: new IconStyle(24, 24, Colors.Gray300),
  large: new IconStyle(32, 32, Colors.Gray300),
};
