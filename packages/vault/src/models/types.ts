export enum TaintStatus {
  UNTAINTED = 0,
  TAINTED = 1,
}

export interface AlgorithmParams {
  memory: number
  iterations: number
  parallelism: number
}