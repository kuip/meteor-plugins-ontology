# Meteor Plugins
Plugins architecture for Meteor. Permits changing Meteor packages from a web interface.

## Screenshot

![Plugins](https://raw.githubusercontent.com/oro8oro/meteor-plugins/master/public/Plugins-screenshot1.png)

## Intent
The developer and end user should be able to hot-plug packages into the running Meteor app. This future package will upgrade the normal packages with this functionality plus eventual extra-functionality:

* loose coupling of packages (for package interactions)
* loose dependecy of packages (for optional extensions)
* package shared data space (for inter-package data exchange)
* inter-package interactions
* controlled extensibility

We will define these in detail in the documentation as soon as these behaviors are implemented.

## Plans
* have a complement app of the sort of Atmospherejs to choose packages from
* ability to define groups of well-integrated packages to extend by group

### Initial Thought
![alt tag](https://raw.githubusercontent.com/oro8oro/meteor-plugins/master/Plugins-class-diagram.png)
