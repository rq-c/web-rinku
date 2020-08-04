module.exports = {
    BASE_URL:'http://localhost:4000/api/',
    NOMINA:{
        GET_MOVEMENT:'nomina/getMovements',
        ADD_MOVEMENT:'nomina/saveMovement',
        ADD_NOMINA:'nomina/savePay',
        GET_PAYMENT:'nomina/getPayments',
        GENERATE: 'nomina/generateNomina'
    },
    EMPLOYEES:{
        GET:'empleados/getData',
        ADD:'empleados/saveData',
        UPDATE:'empleados/updateData',
        DELETE:'empleados/deleteData',
        GET_BY_ID:'empleados/getDataById',
        GETYPE:'empleados/getType',
        GETROL:'empleados/getRol',
        GETSTATUS:'empleados/getStatus'
    },
    LOGIN_URL:'http://apis.coppel.com:50060/sso/api/v2/login'
}