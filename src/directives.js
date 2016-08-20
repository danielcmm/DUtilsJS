app.directive('focusMe', ['$timeout', function ($timeout) {
	return {
		link: function (scope, element) {
			$timeout(function () {
				element[0].focus();
			}, 100);
		}
	};
}]);

app.directive('onEnter', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.bind("keyup", function (event) {
				if (event.which === 13) {
					scope.$apply(function () {
						scope.$eval(attrs.onEnter);
					});
					event.preventDefault();
				}
			});
		}
	}
});

app.directive('maskPersonPin', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs,ctrl) {
			element.bind("keyup", function () {

				element.val(maskPersonPINBR(element.val()));

				if (ctrl && ctrl.$setViewValue){
					ctrl.$setViewValue(element.val());
					ctrl.$render();
				}

			});
		}
	}
});

app.directive('maskCompanyPin', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs,ctrl) {
			element.bind("keyup", function (event) {

				element.val(maskCompanyPINBR(element.val()));

				// Atualiza o valor do ngModel também
				ctrl.$setViewValue(element.val());
				ctrl.$render();

			});
		}
	}
});

app.directive('contextHelp', ['$http', '$uibModal', function ($http, $uibModal) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {

				if (attrs.contextHelp) {

					var title = attrs.contextHelpTitle ? attrs.contextHelpTitle : "Ajuda";

					$http.get("/help/" + attrs.contextHelp).then(function (response) {

						$uibModal.open({
							templateUrl: "help-modal",
							backdrop: 'static',
							resolve: {
								html: function () {
									return response.data;
								}
							},
							controller: ['$uibModalInstance', 'html', function ($uibModalInstance, html) {

								$uibModalInstance.rendered.then(function () {

									$("#help-modal-title").html(title);
									$("#help-modal-body").html(html);

								});

							}]
						});


					});


				}
			});
		}
	}
}]);