const { GLib } = imports.gi;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Soup = imports.gi.Soup;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const API_ADDRESS = `https://app-api.remessaonline.com.br/v1/`
const ENDPOINT = `simulator`

class Extension {
    constructor() {
        this._indicator = null
        this._amountLabel = null
        this._refreshButton = null
        this._refreshIcon = null

        this.settings = ExtensionUtils.getSettings(
            'org.gnome.shell.extensions.remessaonlinesimulator');
    }

    enable() {
        log(`[${Me.metadata.name}]: Enabling...`);
        let indicatorName = `${Me.metadata.name} Indicator`;
        let mainLayout = new St.BoxLayout();

        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        this._amountLabel = new St.Label({
            text: '',
            x_align: 2,
            y_align: 2
        });

        this._refreshButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            x_fill: true,
            y_fill: true,
            track_hover: true
        });

        this._refreshIcon = new St.Icon({
            gicon: new Gio.ThemedIcon({ name: 'view-refresh-symbolic' }),
            style_class: 'system-status-icon'
        });       

        this._refreshButton.set_child(this._refreshIcon);
        this._refreshButton.connect('button-press-event', () => {
            this._refresh(this)
        });

        this.settings.bind(
            'show-refresh-button',
            this._refreshButton,
            'visible',
            Gio.SettingsBindFlags.DEFAULT
        );

        mainLayout.add(this._refreshButton, 0);
        mainLayout.add(this._amountLabel, 1);
        this._indicator.add_child(mainLayout);
        Main.panel.addToStatusArea(indicatorName, this._indicator);

        const autoRefresh = this.settings.get_boolean('auto-refresh')
        let a = 0

        if (autoRefresh) {
            log(`[${Me.metadata.name}]: Auto Refresh is enabled!`);

            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
                log(`[${Me.metadata.name}]: Auto Refresh is running... ${a}`);
                a++
            })
        }

        this._refresh(this)
    }

    disable() {
        log(`[${Me.metadata.name}]: Disabling...`);
        this._indicator.destroy();
        this._indicator = null;
    }

    _refresh(self) {
        log(`[${Me.metadata.name}]: Refreshing...`);
        const inputCurrency = self.settings.get_string('input-currency')
        const outputCurrency = self.settings.get_string('output-currency')
        const amount = self.settings.get_string('amount')
        log(`[${Me.metadata.name}]: Querying for ${inputCurrency} to ${outputCurrency} against ${amount}`);
        const query = `operationType=inbound&inputCurrencyISOCode=${inputCurrency}&outputCurrencyISOCode=${outputCurrency}&amount=${amount}&targetCustomerType=business`
        const requestMessage = Soup.Message.new(
            'GET', API_ADDRESS + ENDPOINT + '?' + query);
        const soupSession = new Soup.SessionAsync()
        soupSession.queue_message(requestMessage, (session, message) => {
            if (message.status_code !== 200) { return; }
            let body = JSON.parse(message.response_body.data);
            log(`[${Me.metadata.name}]: ${body.simulation.amount}`);
            self._amountLabel.set_text(`R$ ${body.simulation.amount}`);
        });
    }
}

function init() {
    log(`[${Me.metadata.name}]: Initializing...`);
    return new Extension();
}

