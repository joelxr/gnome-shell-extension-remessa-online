'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
}

function buildPrefsWidget() {
    this.settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.remessaonlinesimulator');

    let prefsWidget = new Gtk.Grid({
        margin: 18,
        column_spacing: 12,
        row_spacing: 12,
        visible: true
    });

    let title = new Gtk.Label({
        label: `<b>Preferences</b>`,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    let toggleLabel = new Gtk.Label({
        label: 'Show Refresh Button:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(toggleLabel, 0, 1, 1, 1);

    let toggle = new Gtk.Switch({
        active: this.settings.get_boolean ('show-refresh-button'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggle, 1, 1, 1, 1);

    this.settings.bind(
        'show-refresh-button',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    let autoRefreshLabel = new Gtk.Label({
        label: 'Auto Refresh:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(autoRefreshLabel, 0, 2, 1, 1);

    let autoRefresh = new Gtk.Switch({
        active: this.settings.get_boolean ('auto-refresh'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(autoRefresh, 1, 2, 1, 1);

    this.settings.bind(
        'auto-refresh',
        autoRefresh,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    let amountLabel = new Gtk.Label({
        label: 'Amount:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(amountLabel, 0, 3, 1, 1);

    let amount = new Gtk.Entry({
        text: this.settings.get_string('amount'),
        halign: Gtk.Align.END,
        visible: true,
        inputPurpose: Gtk.InputPurpose.NUMBER
    });
    prefsWidget.attach(amount, 1, 3, 1, 1);

    this.settings.bind(
        'amount',
        amount,
        'text',
        Gio.SettingsBindFlags.DEFAULT
    );

    let inputCurrencyLabel = new Gtk.Label({
        label: 'Input Currency:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(inputCurrencyLabel, 0, 4, 1, 1);

    let inputCurrency = new Gtk.Entry({
        text: this.settings.get_string('input-currency'),
        halign: Gtk.Align.END,
        visible: true,
        inputPurpose: Gtk.InputPurpose.NUMBER
    });
    prefsWidget.attach(inputCurrency, 1, 4, 1, 1);

    this.settings.bind(
        'input-currency',
        inputCurrency,
        'text',
        Gio.SettingsBindFlags.DEFAULT
    );

    let outputCurrencyLabel = new Gtk.Label({
        label: 'Output Currency',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(outputCurrencyLabel, 0, 5, 1, 1);

    let outputCurrency = new Gtk.Entry({
        text: this.settings.get_string('output-currency'),
        halign: Gtk.Align.END,
        visible: true,
        inputPurpose: Gtk.InputPurpose.NUMBER
    });
    prefsWidget.attach(outputCurrency, 1, 5, 1, 1);

    this.settings.bind(
        'output-currency',
        outputCurrency,
        'text',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Return our widget which will be added to the window
    return prefsWidget;
}