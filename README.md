# Meteor Plugins for Apps based on Controlled Vocabularies
+ Plugins architecture for Meteor. Permits changing Meteor packages from a web interface.

## General Specs

![General UML] (http://cdn.rawgit.com/kuip/meteor-plugins-ontology/master/public/docs/GeneralUML.svg)

![WiredSequence] (http://cdn.rawgit.com/kuip/meteor-plugins-ontology/master/public/docs/WiredSequence.svg)

![Forms1] (http://cdn.rawgit.com/kuip/meteor-plugins-ontology/master/public/docs/Forms1UML.svg)

![Forms2] (http://cdn.rawgit.com/kuip/meteor-plugins-ontology/master/public/docs/Forms2UML.svg)


Extended https://github.com/kuip/meteor-plugins :

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
