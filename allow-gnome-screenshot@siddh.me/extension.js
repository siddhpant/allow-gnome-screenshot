// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2025  Siddh Raman Pant <@siddhpant on GitHub>

import * as Main from "resource:///org/gnome/shell/ui/main.js";
import {Extension} from "resource:///org/gnome/shell/extensions/extension.js";
import Gio from "gi://Gio";


const APP_NAME = "org.gnome.Screenshot";


export default class AllowGnomeScreenshot extends Extension {
	/**
	 * Read the following to understand:
	 * https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/screenshot.js#L2439
	 * https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/misc/util.js#L356
	 */

	_get_checker_obj() {
		const dbus_service = Main.shellDBusService;
		if (!dbus_service) {
			console.error("Can't find dbus_service");
			return null;
		}

		const ss_service = dbus_service._screenshotService;
		if (!ss_service) {
			console.error("Can't find ss_service");
			return null;
		}

		const checker = ss_service._senderChecker;
		if (!checker) {
			console.error("Can't find checker");
			return null;
		}

		return checker;
	}

	enable() {
		this._we_added_it = false;

		const checker = this._get_checker_obj()
		if (!checker)
			return;

		// Don't do anything if it already exists.
		if (checker._allowlistMap.has(APP_NAME))
			return;

		this._we_added_it = true;

		// Add to pending set (harmless).
		checker._uninitializedNames.add(APP_NAME);

		/**
		 * Create the watcher checking for a gnome-screenshot run (as
		 * it establishes a new DBus).
		 */
		this._watcher_id = Gio.DBus.watch_name(
			Gio.BusType.SESSION,
			APP_NAME,
			Gio.BusNameWatcherFlags.NONE,

			// Ctor: Runs when gnome-screenshot DBus is setup.
			(conn_, name_, owner) => {
				checker._allowlistMap.set(APP_NAME, owner);
				checker._checkAndResolveInitialized(APP_NAME);
			},

			// Dtor: Runs when gnome-screenshot DBus is removed.
			() => {
				checker._allowlistMap.delete(APP_NAME);
				checker._checkAndResolveInitialized(APP_NAME);
			}
		);
	}

	disable() {
		// Proceed only if we did add it.
		if (!this._we_added_it)
			return;

		const checker = this._get_checker_obj()
		if (!checker)
			return;

		// Stop watching for gnome-screenshot DBus.
		Gio.DBus.unwatch_name(this._watcher_id)

		// Remove from pending set.
		checker._uninitializedNames.delete(APP_NAME);

		this._we_added_it = false;
	}
}
