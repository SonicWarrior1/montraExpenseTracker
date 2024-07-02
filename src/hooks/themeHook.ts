import { ColorSchemeName, useColorScheme } from "react-native"
import { useAppSelector } from "../redux/store"
import { COLORS, DARKCOLORS } from "../constants/commonStyles";

export const useAppTheme = () => {
    const theme = useAppSelector(state => state?.user?.currentUser?.theme);
    const authTheme = useAppSelector(state => state?.user?.theme);
    const deviceScheme = useColorScheme();
    // console.log(authTheme)
    if (theme === 'device' || theme === undefined) {
        return handleDeviceTheme({ theme: theme, deviceScheme: deviceScheme, authTheme: authTheme })
    } else {
        const scheme = theme;
        if (scheme === 'light') {
            return COLORS;
        } else {
            return DARKCOLORS
        }
    }
}
const handleDeviceTheme = ({ theme, authTheme, deviceScheme }: { theme: "device" | "light" | "dark" | undefined, authTheme: "device" | "light" | "dark" | undefined, deviceScheme: ColorSchemeName }) => {
    if (theme === undefined && authTheme !== undefined) {
        if (authTheme === 'light') {
            return COLORS;
        } else if (authTheme === 'dark') {
            return DARKCOLORS
        }
    }
    if (deviceScheme === 'light') {
        return COLORS;
    } else {
        return DARKCOLORS
    }
}