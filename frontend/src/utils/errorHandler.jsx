export const handleServiceError = (err) => {
    if (!err.response) {
        return {
            message: err.message || 'Erro de conexão com o servidor.',
            status: 500,
            code: 'NETWORK_ERROR'
        };
    }

    const data = err.response?.data;
    const status = err.response?.status;
    const message = data?.message || data?.msg || data?.error || data?.erro || data?.detail || "Ocorreu um erro inesperado.";

    return {
        message,
        status: status,
        code: data?.error_code || null,
        details: data?.detail || null
    };

};