import { PixelRatio, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("screen");
// based on iphone 5s's scale
const scale = width / 320;

export function normalize(size) {
  const newsize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newsize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newsize)) - 2
  }
}