import storyConfig from './config.json'

import macros from './macro'
import templates from './template'

import { logger } from '@util/Logging'
import { loadData, saveData } from './saveSystem'
import _ from 'lodash'

Config = {
	...Config, ...storyConfig, saves: {
		autoload: checkAutoload(),
		autosave: false,
		id: 'twine-starter',
		isAllowed: function () { return State.passage !== 'Start' },
		slots: 8
	}
};

setup.ImagePath = "assets/";

((Config, State, Story, Engine, Dialog, $document) => {
	// Append Fork Awesome to document head
	$(document.head).append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">')

	// Set State Variables
	variables().debug = Config.debug
	variables().version = 'Pre-Alpha'

	// Config Auto Load if not on Start passage
	$(document).on(':storyready', function (ev) {
		if (checkAutoload())
			Save.autosave.load()
		else
			Engine.show()
	})

	// Default for passagestart routine
	$(document).on(':passagestart', function (ev) {
		if (!ev.passage.tags.includes('noreturn'))
			variables().return = ev.passage.title;
	});

	// Config saving
	Save.onSave.add(function (save, details) {
		logger('Saving...')
		switch (details.type) {
			case 'serialize':
				logger('serialize')
				break
			case 'autosave':
			case 'disk':
			default:
				save.GameData = saveData()
		}
	})

	// Config loading
	Save.onLoad.add(function (save) {
		logger('Loading...')
		loadData(save.GameData)
	})
})(Config, State, Story, Engine, Dialog, $(document));

function checkAutoload() {
	return State.passage !== 'Start' && !_.isEmpty(State.passage) && Save.autosave.ok()
}