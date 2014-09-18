grange-framework
==================
![Header La Grange](http://clients.la-grange.ca/grange/grange_header.jpg "Header La Grange")

JavaScript "Classes" and dependecies for many projects of La Grange.

Notice
-----------------
* It is important to document each modification thoroughly by using the commit description.
* If an example would be a good way to show off the purpose and customisation of the class/plugin.

Structure des dossiers
----------------------
##### /example
Files related to the index.html file only.

***
##### /src
Actual base folder of the framework. Consider this as the root of your project, therefore the following subfolder structure should be the same in your projects.

* _/js/lagrange :
	JavaScript Classes and Dependencies going in their relative folders (structure to come).


Pour faire fonctionner l'exemple
--------------------------------

Il faut configurer pour que les paths de l'app resolvent dans node_modules 

ln -s ../example/app node_modules/app
ln -s ../src/js/lagrange node_modules/lagrange
ln -s ../example/app/example node_modules/example