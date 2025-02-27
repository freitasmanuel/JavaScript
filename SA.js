
// Simulated Annealing (SA). Javascript - Ing. Manuel Freitas 2025.

"use strict";

class Optimizar_SA {
    constructor(Parametros) {
        this.Mejor_Global = null;
        this.Limites_Inf = Parametros.Limites_Inf;
        this.Limites_Sup = Parametros.Limites_Sup;
        this.N_Variables = Parametros.N_Variables;
        this.N_Iteraciones = Parametros.N_Iteraciones;
        this.Funcion_Objetivo = Parametros.Funcion_Objetivo;
        this.T = Parametros.T;
        this.alpha = Parametros.alpha;
        this.epsilon = Parametros.epsilon;
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

    Crear_Solucion_Inicial () {
        var Posicion_Aleatoria = this.Crear_Posicion_Aleatoria(this.Limites_Inf, this.Limites_Sup, this.N_Variables);
        return new Solucion(Posicion_Aleatoria, this.Calcular_Func_Obj(Posicion_Aleatoria));
    };

    Optimizacion() {

        var N_Func_Eval = 0;
        var Pos_Actual, Pos_Vecino, Valor_Vecino, j;
        
        Pos_Actual = this.Crear_Solucion_Inicial();
        this.Mejor_Global = new Solucion(Pos_Actual.Posicion, Pos_Actual.Valor);
        
        while (N_Func_Eval < this.N_Iteraciones && this.T > this.epsilon) {
    
            Pos_Vecino = Pos_Actual.Posicion.slice();
            
            for (var j = 0; j < this.N_Variables; j++) {
                Pos_Vecino[j] = Pos_Actual.Posicion[j] + this.rng.generateRandom(0, 1) * 6;
            } 

            Pos_Vecino = this.Ajustar_Limites(Pos_Vecino);
            Valor_Vecino = this.Calcular_Func_Obj(Pos_Vecino);
            
            if (Valor_Vecino <= Pos_Actual.Valor) { 
                Pos_Actual.Posicion = Pos_Vecino.slice();
                Pos_Actual.Valor = Valor_Vecino;
                if (Pos_Actual.Valor < this.Mejor_Global.Valor) { 
                    this.Mejor_Global = new Solucion(Pos_Actual.Posicion.slice(), Pos_Actual.Valor);
                }
            } else { 
                var prob = Math.random();
                var delta = Valor_Vecino - Pos_Actual.Valor;
                if (prob < Math.exp(-delta / this.T)) { 
                    Pos_Actual.Posicion = Pos_Vecino.slice();
                    Pos_Actual.Valor = Valor_Vecino;
                } 
            }
            
            this.T *= this.alpha; 
            
            N_Func_Eval ++;
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
    "T": 100,
    "alpha": 0.9999,
    "epsilon": 0.001,
    "N_Iteraciones": 50000,
    "Funcion_Objetivo": Fx_Mishra_Bird,
    "Limites_Sup": [0, 0],
    "Limites_Inf": [-10, -6.5],
    "N_Variables": 2
};

var SA = new Optimizar_SA(Parametros);

SA.Optimizacion();