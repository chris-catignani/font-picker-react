import { Category, Font, FontManager, Script, SortOption, Variant } from "@samuelmeuli/font-manager";
import React, { PureComponent } from "react";
declare type LoadingStatus = "loading" | "finished" | "error";
interface Props {
    apiKey: string;
    activeFontFamily: string;
    onChange: (font: Font) => void;
    pickerId: string;
    families: string[];
    categories: Category[];
    scripts: Script[];
    variants: Variant[];
    limit: number;
    sort: SortOption;
    fontManager: FontManager;
}
interface State {
    expanded: boolean;
    loadingStatus: LoadingStatus;
}
export default class FontPicker extends PureComponent<Props, State> {
    static defaultProps: {
        defaultFamily: string;
        pickerId: string;
        families: string[];
        categories: Category[];
        scripts: Script[];
        variants: Variant[];
        limit: number;
        sort: SortOption;
        onChange: () => void;
    };
    state: Readonly<State>;
    fontManager: FontManager;
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    setFontManager(): void;
    onClose(e: MouseEvent): void;
    onSelection(e: React.MouseEvent | React.KeyboardEvent): void;
    setActiveFontFamily(activeFontFamily: string): void;
    generateFontList(fonts: Font[]): React.ReactElement;
    toggleExpanded(): void;
    render(): React.ReactElement;
}
export {};
//# sourceMappingURL=FontPicker.d.ts.map