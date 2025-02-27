
// Differential Evolution (DE). Javascript - Ing. Manuel Freitas 2025.

"use strict";

class Optimizar_DE {
    constructor(Parametros) {
        this.Mejor_Global = null;
        this.Limites_Inf = Parametros.Limites_Inf;
        this.Limites_Sup = Parametros.Limites_Sup;
        this.N_Variables = Parametros.N_Variables;
        this.N_Iteraciones = Parametros.N_Iteraciones;
        this.Funcion_Objetivo = Parametros.Funcion_Objetivo;
        this.N_Individuos = Parametros.N_Individuos;
        this.F = Parametros.F;
        this.CR = Parametros.CR;
        this.Soluciones = [];
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
        
            this.Soluciones[i] = new Solucion(Posicion_Aleatoria, func_obj);
    
            if (i == 0 || func_obj < this.Mejor_Global.Valor) {
                this.Mejor_Global = new Solucion(Posicion_Aleatoria, func_obj);
            }

        }

    };

    Optimizacion() {

        var N_Func_Eval = 0;
        var i, rA, rB, rC, R, rI;
        var a = [], b = [], c = [], y = [], x = [];
    
        this.Crear_Poblacion_Inicial();
    
        while (N_Func_Eval < this.N_Iteraciones) {

            for (i = 0; i < this.N_Individuos; i++) {

                do {
                    rA = Math.floor((Math.random() * this.N_Individuos));
                } while (rA === i);
    
                a = this.Soluciones[rA].Posicion;
    
                do {
                    rB = Math.floor((Math.random() * this.N_Individuos));
                } while (rB === i || rB === rA);
    
                b = this.Soluciones[rB].Posicion;
    
                do {
                    rC = Math.floor((Math.random() * this.N_Individuos));
                } while (rC === i || rC === rA || rC === rB);
    
                c = this.Soluciones[rC].Posicion;
    
                R = Math.floor((Math.random() * this.N_Variables)); 
    
                x = this.Soluciones[i].Posicion;
                
                y = x.slice(0);
                
                for (var j = 0; j < this.N_Variables; j++) {
                    rI = Math.random();
                    if (rI < this.CR || j === R) {
                        y[j] = a[j] + this.F * (b[j] - c[j]);
                    } else {
                        y[j] = x[j];
                    }
                }
    
                y = this.Ajustar_Limites(y);
                var fy = this.Calcular_Func_Obj(y);
    
                if (fy < this.Soluciones[i].Valor) {
                    this.Soluciones[i].Posicion = y.slice(0);
                    this.Soluciones[i].Valor = fy;
                   
                    if (fy < this.Mejor_Global.Valor) {
                        this.Mejor_Global.Posicion = y.slice(0);
                        this.Mejor_Global.Valor = fy;
                    }
                }
            }

            N_Func_Eval++;
            
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
    "CR": 0.1,
    "F": 0.5,
    "N_Iteraciones": 50000,
    "Funcion_Objetivo": Fx_Mishra_Bird,
    "Limites_Sup": [0, 0],
    "Limites_Inf": [-10, -6.5],
    "N_Variables": 2
};

var DE = new Optimizar_DE(Parametros);

DE.Optimizacion();