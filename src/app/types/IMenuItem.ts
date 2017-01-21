/**
 * Properties for sidebar component menu item.
 */
export interface IMenuItem {
    /**
     * Name of the menu.
     */
    name: string;
    /**
     * Class name(s) of displayed icon.
     */
    iconClass: string;
    /**
     * Image link of displayed avatar.
     */
    avatarLink: string;
    /**
     * Link for the router.
     */
    routerLink: string;
}
