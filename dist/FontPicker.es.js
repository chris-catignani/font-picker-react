import { FontManager, FONT_FAMILY_DEFAULT, OPTIONS_DEFAULTS } from '@samuelmeuli/font-manager';
import React, { PureComponent } from 'react';

function getFontId(fontFamily) {
    return fontFamily.replace(/\s+/g, "-").toLowerCase();
}
class FontPicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            loadingStatus: "loading",
        };
        this.setFontManager();
        this.onClose = this.onClose.bind(this);
        this.onSelection = this.onSelection.bind(this);
        this.setActiveFontFamily = this.setActiveFontFamily.bind(this);
        this.toggleExpanded = this.toggleExpanded.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { activeFontFamily, onChange } = this.props;
        if (activeFontFamily !== prevProps.activeFontFamily) {
            this.setActiveFontFamily(activeFontFamily);
        }
        if (onChange !== prevProps.onChange) {
            this.fontManager.setOnChange(onChange);
        }
    }
    setFontManager() {
        if (this.props.fontManager) {
            this.fontManager = this.props.fontManager;
            this.setState({
                loadingStatus: "finished",
            });
            return;
        }
        const { apiKey, activeFontFamily, pickerId, families, categories, scripts, variants, limit, sort, onChange, } = this.props;
        const options = {
            pickerId,
            families,
            categories,
            scripts,
            variants,
            limit,
            sort,
        };
        this.fontManager = new FontManager(apiKey, activeFontFamily, options, onChange);
        this.fontManager
            .init()
            .then(() => {
            this.setState({
                loadingStatus: "finished",
            });
        })
            .catch((err) => {
            this.setState({
                loadingStatus: "error",
            });
            console.error("Error trying to fetch the list of available fonts");
            console.error(err);
        });
    }
    onClose(e) {
        let targetEl = e.target;
        const fontPickerEl = document.getElementById(`font-picker${this.fontManager.selectorSuffix}`);
        while (true) {
            if (targetEl === fontPickerEl) {
                return;
            }
            if (targetEl.parentNode) {
                targetEl = targetEl.parentNode;
            }
            else {
                this.toggleExpanded();
                return;
            }
        }
    }
    onSelection(e) {
        const target = e.target;
        const activeFontFamily = target.textContent;
        if (!activeFontFamily) {
            throw Error(`Missing font family in clicked font button`);
        }
        this.setActiveFontFamily(activeFontFamily);
        this.toggleExpanded();
    }
    setActiveFontFamily(activeFontFamily) {
        this.fontManager.setActiveFont(activeFontFamily);
    }
    generateFontList(fonts) {
        const { activeFontFamily } = this.props;
        const { loadingStatus } = this.state;
        if (loadingStatus !== "finished") {
            return React.createElement("div", null);
        }
        return (React.createElement("ul", { className: "font-list" }, fonts.map((font) => {
            const isActive = font.family === activeFontFamily;
            const fontId = getFontId(font.family);
            return (React.createElement("li", { key: fontId, className: "font-list-item" },
                React.createElement("button", { type: "button", id: `font-button-${fontId}${this.fontManager.selectorSuffix}`, className: `font-button ${isActive ? "active-font" : ""}`, onClick: this.onSelection, onKeyPress: this.onSelection }, font.family)));
        })));
    }
    toggleExpanded() {
        const { expanded } = this.state;
        if (expanded) {
            this.setState({
                expanded: false,
            });
            document.removeEventListener("click", this.onClose);
        }
        else {
            this.setState({
                expanded: true,
            });
            document.addEventListener("click", this.onClose);
        }
    }
    render() {
        const { activeFontFamily, sort } = this.props;
        const { expanded, loadingStatus } = this.state;
        const fonts = Array.from(this.fontManager.getFonts().values());
        if (sort === "alphabet") {
            fonts.sort((font1, font2) => font1.family.localeCompare(font2.family));
        }
        return (React.createElement("div", { id: `font-picker${this.fontManager.selectorSuffix}`, className: expanded ? "expanded" : "" },
            React.createElement("button", { type: "button", className: "dropdown-button", onClick: this.toggleExpanded, onKeyPress: this.toggleExpanded },
                React.createElement("p", { className: "dropdown-font-family" }, activeFontFamily),
                React.createElement("p", { className: `dropdown-icon ${loadingStatus}` })),
            loadingStatus === "finished" && this.generateFontList(fonts)));
    }
}
FontPicker.defaultProps = {
    defaultFamily: FONT_FAMILY_DEFAULT,
    pickerId: OPTIONS_DEFAULTS.pickerId,
    families: OPTIONS_DEFAULTS.families,
    categories: OPTIONS_DEFAULTS.categories,
    scripts: OPTIONS_DEFAULTS.scripts,
    variants: OPTIONS_DEFAULTS.variants,
    limit: OPTIONS_DEFAULTS.limit,
    sort: OPTIONS_DEFAULTS.sort,
    onChange: () => { },
};

export default FontPicker;
