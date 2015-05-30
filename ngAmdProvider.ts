define(['angular'],(angular) => {
    angular.module('ng-amd', []).provider('ngAmd', ['$controllerProvider', ngAmdProvider]);

    function ngAmdProvider($controllerProvider) {
        this.ctrl = (path, opts)=> {
            if (!opts.resolve) opts.resolve = {};
            var ctrlName = normalizePath(path);
            opts.resolve.loadController = (['$q', ($q)=> {
                return resolveController($q, path, ctrlName);
            }]);
            opts.controller = ctrlName;
            return opts;
        };

        function resolveController($q, controllerDependency, ctrlName) {
            var defer = $q.defer();
            requirejs([controllerDependency], (ctrl) => {
                defer.resolve(ctrl);
                $controllerProvider.register(ctrlName, ctrl);
            });
            return defer.promise;
        };

        function normalizePath(path) {
            var parts = path.split('/');
            var l = parts.length;
            
            parts[l - 1] = parts[l - 1].split('.')[0];
            for (var i = 0; i < l; i++) {
                if (parts[i])
                    parts[i] = capitalizeFirstLetter(parts[i]);
            }
            return parts.join('');
        }

        function capitalizeFirstLetter(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        }

        this.$get = () => {
            return angular.noop;
        };
    }
});
