
// Evolution Strategies (ES). Javascript - Ing. Manuel Freitas 2025.

"use strict";

class Optimizar_ES {
    constructor(Parametros) {
        this.Mejor_Global = null;
        this.Limites_Inf = Parametros.Limites_Inf;
        this.Limites_Sup = Parametros.Limites_Sup;
        this.N_Variables = Parametros.N_Variables;
        this.N_Iteraciones = Parametros.N_Iteraciones;
        this.Funcion_Objetivo = Parametros.Funcion_Objetivo;
        this.N_Individuos = Parametros.N_Individuos;
        this.sigma = Parametros.sigma;
        this.lambda = Parametros.lambda;
        this.tau = Parametros.tau;
        this.rng = new MarsagliaPolar();
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

    Chequear_Limites = function (num, i) {
        if (num > this.Limites_Sup[i] || num < this.Limites_Inf[i]) {
            return false;
        }
        return true;
    };

    Crear_Padre() {
        var Posicion_Aleatoria = this.Crear_Posicion_Aleatoria(this.Limites_Inf, this.Limites_Sup, this.N_Variables);
        return new ES_Solucion_No_Correlacionada(Posicion_Aleatoria, this.Calcular_Func_Obj(Posicion_Aleatoria), this.sigma);
    };

    Crear_Vecino() {
        var Vecino_Pos, sigmaPrime, i;
        var step;

        Vecino_Pos = this.Mejor_Global.Posicion.slice(0);
        sigmaPrime = this.Mejor_Global.sigma * Math.exp(this.tau * this.rng.generateRandom(0, 1));
        
        for (i = 0; i < this.N_Variables; i++) { 
            do {
                step = sigmaPrime * this.rng.generateRandom(0, 1);
            } while (this.Chequear_Limites(Vecino_Pos[i] + step, i) === false);
            Vecino_Pos[i] += step;
        }
        
        return new ES_Solucion_No_Correlacionada(Vecino_Pos, this.Calcular_Func_Obj(Vecino_Pos), sigmaPrime);
    };

    Optimizacion() {

        var N_Func_Eval = 0;
        var i, Vecino;
        var Mejor_Valor, Mejor_Pos = [], Mejor_Sigma;
        
        this.Mejor_Global = this.Crear_Padre();
        
        while (N_Func_Eval < this.N_Iteraciones) {

            Mejor_Valor = Number.MAX_VALUE;
            
            for (i = 0; i < this.lambda; i++) {
            
                Vecino = this.Crear_Vecino();
            
                if(Vecino.Valor <= Mejor_Valor) { 
                    Mejor_Valor = Vecino.Valor;
                    Mejor_Pos = Vecino.Posicion.slice(0);
                    Mejor_Sigma = Vecino.sigma;
                }
            
            }
            
            N_Func_Eval ++;
            
            if (Mejor_Valor <= this.Mejor_Global.Valor) { 
                this.Mejor_Global = new ES_Solucion_No_Correlacionada(Mejor_Pos, Mejor_Valor, Mejor_Sigma);
            }
            
        }

        console.log({"Iter.": N_Func_Eval, "Func. Obj.": this.Mejor_Global.Valor, "Posicion": this.Mejor_Global.Posicion});

    };

}

class ES_Solucion_No_Correlacionada {
    constructor(Posicion, Valor, sigma) {
        this.Posicion = Posicion.slice(0);
        this.Valor = Valor;
        this.sigma = sigma;
    }
}

class MarsagliaPolar {
    constructor() {
        this.hasSpare = false;
        this.spare;
    };

    generateRandom (mean, stdDev) {
        if (this.hasSpare)
        {
            this.hasSpare = false;
            return mean + stdDev * this.spare;
        }

        this.hasSpare = true;
        var u, v, s;
        do {
            u = Math.random() * 2.0 - 1.0;
            v = Math.random() * 2.0 - 1.0;
            s = u * u + v * v;
        } while( (s >= 1.0) || (s == 0.0) );
        
        s = Math.sqrt(-2.0 * Math.log(s) / s);
        this.spare = v * s;
        return mean + stdDev * u * s;
    };

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
    "sigma": 5,
    "lambda": 100,
    "tau": 0.18,
    "N_Iteraciones": 50000,
    "Funcion_Objetivo": Fx_Mishra_Bird,
    "Limites_Sup": [0, 0],
    "Limites_Inf": [-10, -6.5],
    "N_Variables": 2
};

var ES = new Optimizar_ES(Parametros);

ES.Optimizacion();
