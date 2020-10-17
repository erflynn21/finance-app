import { Meteor } from 'meteor/meteor';
import App from '../imports/ui/App.svelte';
import '../imports/startup/accounts-config';
import '../imports/startup/client/serviceWorker.js';
 
 
Meteor.startup(() => {
  new App({
    target: document.getElementById('app')
  });
});