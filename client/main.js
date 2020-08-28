import { Meteor } from 'meteor/meteor';
import App from '../imports/ui/App.svelte';
import '../imports/startup/accounts-config'
 
 
Meteor.startup(() => {
  new App({
    target: document.getElementById('app')
  });
});