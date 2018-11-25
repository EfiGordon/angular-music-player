export interface ISubject{
  registerObserver(o: IObserver);
  removeObserver(o: IObserver);
  notifyObservers(obj);
}

export interface IObserver{
  update(update: any);
}
