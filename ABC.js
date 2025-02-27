
// Artificial Bee Colony (ABC). Javascript - Ing. Manuel Freitas 2025.

"use strict";

class Optimizar_ABC {
    constructor(Parametros) {
        this.Mejor_Global = null;
        this.Limites_Inf = Parametros.Limites_Inf;
        this.Limites_Sup = Parametros.Limites_Sup;
        this.N_Variables = Parametros.N_Variables;
        this.N_Iteraciones = Parametros.N_Iteraciones;
        this.Funcion_Objetivo = Parametros.Funcion_Objetivo;
        this.N_Individuos = Parametros.N_Individuos;
        this.Numero_Comida = this.N_Individuos / 2;
        this.Comidas = [];
        this.Intentos = [];
    }

    Calcular_Func_Obj(Arreglo) {
        return this.Funcion_Objetivo(Arreglo);
    }

    Ajustar_Limites (Arreglo) {
        for (var i = 0; i < Arreglo.length; i++) {
            if (Arreglo[i] > this.Limites_Sup[i]) {
                Arreglo[i] = this.Limites_Sup[i];
            } else if (Arreglo[i] < this.Limites_Inf[i]) {
                Arreglo[i] = this.Limites_Inf[i];
            }
        }
        
        return Arreglo;
    };

    Crear_Posicion_Aleatoria(Limites_Inf, Limites_Sup, N_Variables) {
        var Posicion_Aleatoria = [];
        var i;
    
        for (i = 0; i < N_Variables; i++) {    
            Posicion_Aleatoria[i] = Limites_Inf[i] + Math.random() * (Limites_Sup[i] - Limites_Inf[i]);
        }

        Posicion_Aleatoria = this.Ajustar_Limites(Posicion_Aleatoria);
    
        return Posicion_Aleatoria;
    }

    Crear_Poblacion_Inicial () {

        var i, Posicion_Aleatoria, func_obj;

        for (i = 0; i < this.N_Individuos; i++) {
        
            Posicion_Aleatoria = this.Crear_Posicion_Aleatoria(this.Limites_Inf, this.Limites_Sup, this.N_Variables);
        
            func_obj = this.Calcular_Func_Obj(Posicion_Aleatoria);
        
            this.Comidas[i] = new Solucion(Posicion_Aleatoria, func_obj);
            this.Intentos[i] = 0;
    
            if (i == 0 || func_obj < this.Mejor_Global.Valor) {
                this.Mejor_Global = new Solucion(Posicion_Aleatoria, func_obj);
            }

        }

    };

    Optimizacion() {

        var N_Func_Eval = 0;
        var i, t, min = Number.MAX_VALUE, Indice_Min = 0;
        var Cambio_Param_2, Indice_Vecino, Pos_Vecino, Pos_Nuevo, Pos_Actual, Nuevo_Valor_Func;

        this.Crear_Poblacion_Inicial();

        while (N_Func_Eval < this.N_Iteraciones) {

            for (i = 0; i < this.Numero_Comida; i++) {

                Cambio_Param_2 = Math.floor((Math.random() * this.N_Variables));

                do {
                    Indice_Vecino = Math.floor((Math.random() * this.Numero_Comida));
                } while (Indice_Vecino === i); 

                Pos_Actual = this.Comidas[i].Posicion;
                Pos_Vecino = this.Comidas[Indice_Vecino].Posicion;
                Pos_Nuevo = Pos_Actual.slice(0);
                Pos_Nuevo[Cambio_Param_2] = Pos_Actual[Cambio_Param_2] + (Pos_Actual[Cambio_Param_2] - Pos_Vecino[Cambio_Param_2]) * (Math.random() - 0.5) * 2;

                Pos_Nuevo = this.Ajustar_Limites(Pos_Nuevo);

                Nuevo_Valor_Func = this.Calcular_Func_Obj(Pos_Nuevo);

                if (Nuevo_Valor_Func <= this.Comidas[i].Valor) { 
                    this.Intentos[i] = 0; 
                    this.Comidas[i].Posicion = Pos_Nuevo.slice(0);
                    this.Comidas[i].Valor = Nuevo_Valor_Func;
                } else {
                    this.Intentos[i]++; 
                }

            }

            var Valor_Transformado = [];
            for (i = 0; i < this.Numero_Comida; i++) {
                if (this.Comidas[i].Valor >= 0) {
                    Valor_Transformado[i] = 1 / (this.Comidas[i].Valor + 1);
                } else {
                    Valor_Transformado[i] = 1 + Math.abs(this.Comidas[i].Valor);
                }
            }

            var maxfit = Valor_Transformado[0];

            for (i = 1; i < this.Numero_Comida; i++)
            {
                if (Valor_Transformado[i] > maxfit) {
                    maxfit = Valor_Transformado[i];
                }
            }

            var prob = [];

            for (i = 0; i < this.Numero_Comida; i++)
            {
                prob[i] = (0.9 * (Valor_Transformado[i] / maxfit)) + 0.1;
            }

            i = 0;
            t = 0;
            while (t < this.Numero_Comida) {
                var r = Math.random();

                if (r < prob[i]) {
                    t++;

                    Cambio_Param_2 = Math.floor((Math.random() * this.N_Variables));

                    do {
                        Indice_Vecino = Math.floor((Math.random() * this.Numero_Comida));
                    } while (Indice_Vecino === i); 

                    Pos_Actual = this.Comidas[i].Posicion;
                    Pos_Vecino = this.Comidas[Indice_Vecino].Posicion;
                    Pos_Nuevo = Pos_Actual.slice(0);
                    Pos_Nuevo[Cambio_Param_2] = Pos_Actual[Cambio_Param_2] + (Pos_Actual[Cambio_Param_2] - Pos_Vecino[Cambio_Param_2]) * (Math.random() - 0.5) * 2;

                    Pos_Nuevo = this.Ajustar_Limites(Pos_Nuevo);

                    Nuevo_Valor_Func = this.Calcular_Func_Obj(Pos_Nuevo);

                    if (Nuevo_Valor_Func <= this.Comidas[i].Valor) { 
                        this.Intentos[i] = 0; 
                        this.Comidas[i].Posicion = Pos_Nuevo.slice(0);
                        this.Comidas[i].Valor = Nuevo_Valor_Func;
                    } else {
                        this.Intentos[i]++; 
                    }
                }
                i++;
                if (i === this.Numero_Comida) {
                    i = 0;
                }
            }

            min = this.Comidas[0].Valor;
            Indice_Min = 0;
            for (i = 1; i < this.Numero_Comida; i++) {
                if (this.Comidas[i].Valor < min) {
                    min = this.Comidas[i].Valor;
                    Indice_Min = i;
                }
            }
            if (min < this.Mejor_Global.Valor) {
                this.Mejor_Global.Posicion = this.Comidas[Indice_Min].Posicion.slice(0);
                this.Mejor_Global.Valor = min;
            }

            N_Func_Eval ++;

            var Indice_Max_Intentos = 0;
            for (i = 1; i < this.Numero_Comida; i++) {
                if (this.Intentos[i] > this.Intentos[Indice_Max_Intentos]) {
                    Indice_Max_Intentos = i;
                }
            }

            if (this.Intentos[Indice_Max_Intentos] >= this.limit)
            {
                var randPos = this.Crear_Posicion_Aleatoria(this.lowerBound, this.upperBound, this.N_Variables);
                var randF = this.Calcular_Func_Obj(randPos);
                N_Func_Eval++;
                if (N_Func_Eval >= this.N_Iteraciones) {
                    break;
                }
                this.Comidas[Indice_Max_Intentos] = new Solucion(randPos, randF); 
                this.Intentos[Indice_Max_Intentos] = 0; 
            }
        }
            
            console.log({"Iter.": N_Func_Eval, "Func. Obj.": this.Mejor_Global.Valor, "Posicion": this.Mejor_Global.Posicion});
    };

}

class Solucion {

    constructor(Posicion, Valor) {
        this.Posicion = Posicion.slice(0);
        this.Valor = Valor;
    }

};

function Fx_Mishra_Bird(Arreglo) {
    
    var Total = 0.0;

    var x1 = Arreglo[0];
    var x2 = Arreglo[1];

    Total = Math.sin(x2) * Math.exp(1-Math.cos(x1)) ** 2 + Math.cos(x1) * Math.exp(1-Math.sin(x2)) ** 2 + (x1-x2) ** 2;

    return Total;

}

var Parametros = {
    "N_Individuos": 100,
    "N_Iteraciones": 50000,
    "Funcion_Objetivo": Fx_Mishra_Bird,
    "Limites_Sup": [0, 0],
    "Limites_Inf": [-10, -6.5],
    "N_Variables": 2
};

var ABC = new Optimizar_ABC(Parametros);

ABC.Optimizacion();