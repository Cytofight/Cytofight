export function createBarrier(location, ...vertices) {
  // all locations are x-y ARRAYS
  const barrier = game.add.graphics(0, 0);
  barrier.beginFill(0xa9a904);
  barrier.lineStyle(4, 0xfd02eb, 1);
  barrier.moveTo(...location)
  vertices.forEach(vertex => {
    barrier.lineTo(...vertex)
  })
  this.add.graphics(barrier) //??
  this.physics.enable(barrier)
}