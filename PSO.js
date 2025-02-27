
// Particle Swarm Optimization (PSO). Javascript - Ing. Manuel Freitas 2025.

"use strict";

class Optimizar_PSO {
    constructor(Parametros) {
        this.Mejor_Global = null;
        this.Limites_Inf = Parametros.Limites_Inf;
        this.Limites_Sup = Parametros.Limites_Sup;
        this.N_Variables = Parametros.N_Variables;
        this.N_Iteraciones = Parametros.N_Iteraciones;
        this.Funcion_Objetivo = Parametros.Funcion_Objetivo;

        this.N_Particulas = Parametros.N_Particulas;
        this.Inercia = Parametros.Inercia;
        this.Peso_Cognitivo = Parametros.Peso_Cognitivo;
        this.Peso_Social = Parametros.Peso_Social;
        this.Enjambre = [];
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

        var i, d, Posicion_Aleatoria, Velocidad_Aleatoria = [], func_obj;

        for (i = 0; i < this.N_Particulas; i++) {
        
            Posicion_Aleatoria = this.Crear_Posicion_Aleatoria(this.Limites_Inf, this.Limites_Sup, this.N_Variables);
        
            for (d = 0; d < this.N_Variables; d++) {
                Velocidad_Aleatoria[d] = Math.random() * (this.Limites_Sup[d] - this.Limites_Inf[d]);
                Velocidad_Aleatoria[d] *= Math.random() > 0.5 ? -1 : 1;
            }
        
            func_obj = this.Calcular_Func_Obj(Posicion_Aleatoria);
        
            this.Enjambre[i] = new Particula(Posicion_Aleatoria, func_obj, Velocidad_Aleatoria);
    
            if (i == 0 || func_obj < this.Mejor_Global.Valor) {
                this.Mejor_Global = new Particula(Posicion_Aleatoria, func_obj, Velocidad_Aleatoria);
            }

        }

    };

    Optimizacion() {

        var N_Func_Eval = 0, i, d, r_pc, r_ps, Particula;
    
        this.Crear_Poblacion_Inicial();
    
        while (N_Func_Eval < this.N_Iteraciones) {

            for (i = 0; i < this.N_Particulas; i++) {
            
                Particula = this.Enjambre[i]; 
            
                for (d = 0; d < this.N_Variables; d++) {
            
                    r_pc = Math.random();
                    r_ps = Math.random();
    
                    Particula.Velocidad[d] = this.Inercia * Particula.Velocidad[d]
                            + this.Peso_Cognitivo * r_pc * (Particula.Mejor_Posicion[d] - Particula.Posicion[d])
                            + this.Peso_Social * r_ps * (this.Mejor_Global.Posicion[d] - Particula.Posicion[d]);
            
                }

                for (d = 0; d < this.N_Variables; d++) {
                    
                    Particula.Posicion[d] += Particula.Velocidad[d];
                
                }
                
                Particula.Posicion = this.Ajustar_Limites(Particula.Posicion);
                Particula.Valor = this.Calcular_Func_Obj(Particula.Posicion);
                
                if (Particula.Valor < Particula.Mejor_Valor) {

                    Particula.Mejor_Posicion = Particula.Posicion.slice(0);
                    Particula.Mejor_Valor = Particula.Valor;
                    
                    if (Particula.Mejor_Valor < this.Mejor_Global.Valor) {
                        this.Mejor_Global.Posicion = Particula.Mejor_Posicion.slice(0);
                        this.Mejor_Global.Valor = Particula.Mejor_Valor;
                    }

                    console.log({"Iter.": N_Func_Eval, "Func. Obj.": this.Mejor_Global.Valor, "Posicion": this.Mejor_Global.Posicion});

                }
            
            }

            N_Func_Eval++;

        }

        console.log({"Iter.": N_Func_Eval, "Func. Obj.": this.Mejor_Global.Valor, "Posicion": this.Mejor_Global.Posicion});

    };

}

class Particula {

    constructor(Posicion, Valor, Velocidad) {
        this.Posicion = Posicion.slice(0);
        this.Valor = Valor;
        this.Velocidad = Velocidad.slice(0);
        this.Mejor_Posicion = Posicion.slice(0);
        this.Mejor_Valor = Valor;
    }

}

function Fx_Mishra_Bird(Arreglo) {
    
    var Total = 0.0;

    var x1 = Arreglo[0];
    var x2 = Arreglo[1];

    Total = Math.sin(x2) * Math.exp(1-Math.cos(x1)) ** 2 + Math.cos(x1) * Math.exp(1-Math.sin(x2)) ** 2 + (x1-x2) ** 2;

    return Total;

}

var Parametros = {
    "N_Particulas": 100,
    "Inercia": 0.8,
    "Peso_Cognitivo": 2,
    "Peso_Social": 2,
    "N_Iteraciones": 50000,
    "Funcion_Objetivo": Fx_Mishra_Bird,
    "Limites_Sup": [0, 0],
    "Limites_Inf": [-10, -6.5],
    "N_Variables": 2
};

var PSO = new Optimizar_PSO(Parametros);

PSO.Optimizacion();