axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.interceptors.request.use(function (config) {

	window.$(".block-on-load").prop('disabled',true);

	if (!config.timeout){
		config.timeout = 10000;
	}

	return config;
}, function (error) {

	return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {

	$(".block-on-load").prop('disabled',false);
	removeFormErrors();

	return response;
}, function (error) {

	$(".block-on-load").prop('disabled',false);
	removeFormErrors();

	if (!error.response){
		appAlert("O servidor demorou muito para responder. Por favor, tente novamente e entre em contato caso o problema persista.");
		return Promise.reject(error);
	}

	if (error.response.status == '901') {

		alert("Usuário não logado ou sessão expirada. Por favor, identifique-se novamente.");

		let url = '/auth/login';
		window.location.href = url;
		return Promise.reject(error);
	}

	if (error.response.status == '403'){

		appAlert('Você não tem permissão para executar esta ação.');

	}else if (error.response.status == '401'){

		appAlert('Sessão expirada');
		window.location.href = "/auth/login";

	}else if (error.response.status == '404'){

		appAlert(response.data);

	}else if (error.response.status == '419'){

		alert("Você ficou muito tempo sem utilizar a página e sua sessão expirou.");
		window.location.reload();

	}else if (error.response.status == '500'){

		let mensagemPadrao = "Erro inesperado. Por favor, tente novamente em alguns minutos.";
		appAlert(mensagemPadrao);

	}else if (error.response.status == -1){

		appAlert("Erro de comunicação com o servidor. Aguarde um pouco e tente novamente.");

	}

	//Tratamento padrao de exibicao de erros em forms
	if (error.response.status == 422 && !error.config.ignore422){

		const uid = error.config.uid;

		let aux=0;
		for (let field in error.response.data.errors){

			let fieldId = uid ? field + "-" + uid : field;

			if (aux ==0){
				$("#" + fieldId.replace(/\./g,"\\.")).focus();
				aux++;
			}

			addFormError(fieldId,error.response.data.errors[field]);
		}

		if (error.response.data.default){
			appAlert(error.response.data.default);
		}

	}

	return Promise.reject(error);
});