import { useColorScheme } from "react-native"
import { useAppSelector } from "../redux/store"
import { COLORS, DARKCOLORS } from "../constants/commonStyles";

export const useAppTheme = () => {
    const theme = useAppSelector(state => state?.user?.currentUser?.theme);
    const deviceScheme = useColorScheme();
    if (theme === 'device' || theme === undefined) {
        if (deviceScheme === 'light') {
            return COLORS;
        } else {
            return DARKCOLORS
        }
    } else {
        const scheme = theme;
        if (scheme === 'light') {
            return COLORS;
        } else {
            return DARKCOLORS
        }
    }

}