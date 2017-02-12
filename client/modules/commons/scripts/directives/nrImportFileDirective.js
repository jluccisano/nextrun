/*angular.module('ifApp.commons').directive('nrImportFile', function($rootScope) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModel) {
            $scope.reader = new FileReader();
            $scope.file = null;
            
            $element.bind("change", function(event)  {
                // Get the File
                $scope.file = event.target.files[0];
                $scope.reader.readAsText($scope.file);
            });

            $scope.reader.onload = function(event) {
                $scope.$apply(function() {
                    ngModel.$setViewValue($element.val());
                    ngModel.$render();
                });

                $rootScope.$broadcast("onFileReadyForImport", $scope.reader.result);
            };
        }
    }
});*/

/*angular.module('ifApp.commons').directive('ifDownload', ['ImportExportService', function(ImportExportService, $log) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            $element.bind('click', function(event) {
                var exportType = $attrs.ifExportType;
                var chart = $scope.$eval($attrs.ifJsonContent);
                var ids = $scope.$eval($attrs.ifExportedIds);

                if ($scope.hasData !== true) {
                    // Export by id is the priority if available
                    if (ids) {
                        event.preventDefault();
                        event.stopPropagation();
                        $scope.getZipForExportType(exportType, ids);
                    } else if (chart) {
                        var name = chart.data.name;
                        var href = ImportExportService.generateDownloadLinkForObject(chart.data);
                        $element.attr("href", href);
                        $element.attr("download", name + ".json");
                    }
                } else {
                    // Setting this flag to false so we can get new data on next click (mouse click)
                    $scope.hasData = false;
                }
            });

            // dirty hack
            // $element.triggerHandler("click") didn't initiate the download
            // Still we have href and download attribute set up
            $scope.triggerDownload = function() {
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                $element[0].dispatchEvent(event);
            };

            $scope.getZipForExportType = function(exportType, ids) {
                var promise = null;
                switch (exportType) {
                    case "workflow":
                        promise = ImportExportService.exportZip(ids, "WORKFLOW");
                        break;
                    case "ingest":
                        // TODO: Add promise in case of multiple ingest export
                        return;
                        break;
                    case "process":
                        // TODO: Add promise in case of multiple process export
                        return;
                        break;
                    case "serviceTemplate":
                        promise = ImportExportService.exportZip(ids, "SERVICE_TEMPLATES");
                        break;
                    default:
                        return;
                        break;
                }

                promise.then(function(result) {
                    $scope.hasData = true;
                    $element.attr("href", result);
                    $element.attr("download", exportType + ".zip");
                    $scope.triggerDownload();
                }).catch(function(error) {
                    $log.error(error);
                });
            }
        }
    };
}]);

<li>
    <a href="" id="upload_link">
        <span class="glyphicon glyphicon-cloud-download"></span>
        <span>Import</span>
    </a>
    <input type="file" ng-hide="true"/>
</li>

<li>
    <a download="{{chart.data.name}}.json" if-download if-export-type="process" if-json-content="chart" ng-hide="processForm.$invalid">
        <span class="glyphicon glyphicon-cloud-download"></span>
        <span>Export</span>
    </a>
</li>
<li>
    <a href="" if-import-json if-chart-type="process" id="upload_link">
        <span class="glyphicon glyphicon-cloud-download"></span>
        <span>Import</span>
    </a>
</li>*/