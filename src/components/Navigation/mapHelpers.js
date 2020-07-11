const earthRadius = 6371
const defaultPositionChangeToleranceRatio = 0.1

function getOldBoundsAxisBounds ({ axis, oldBounds, positionChangeToleranceRatio }) {
  const NE = oldBounds._northEast[axis]
  const SW = oldBounds._southWest[axis]
  const angle = NE - SW
  const angleTolerance = angle * positionChangeToleranceRatio
  const NEmax = NE + angleTolerance
  const NEmin = NE - angleTolerance
  const SWmax = SW + angleTolerance
  const SWmin = SW - angleTolerance
  return {
    NEmax, NEmin, SWmax, SWmin
  }
}

function isSomeNewBoundOutOfOldBoundsAxisBounds ({ axis, newBounds, axisBoundsBounds }) {
  const NE = newBounds._northEast[axis]
  const SW = newBounds._southWest[axis]
  if (NE > axisBoundsBounds.NEmax) return true
  if (NE < axisBoundsBounds.NEmin) return true
  if (SW > axisBoundsBounds.SWmax) return true
  if (SW < axisBoundsBounds.SWmin) return true
  return false
}

export function isOutOfBoundsBounds ({ newBounds, oldBounds, positionChangeToleranceRatio = defaultPositionChangeToleranceRatio }) {
  const latOldBoundsBounds = getOldBoundsAxisBounds({ axis: 'lat', oldBounds, positionChangeToleranceRatio })
  const lngOldBoundsBounds = getOldBoundsAxisBounds({ axis: 'lng', oldBounds, positionChangeToleranceRatio })
  const isOutOfLatBoundsBounds = isSomeNewBoundOutOfOldBoundsAxisBounds({ axis: 'lat', newBounds, axisBoundsBounds: latOldBoundsBounds })
  const isOutOfLngBoundsBounds = isSomeNewBoundOutOfOldBoundsAxisBounds({ axis: 'lng', newBounds, axisBoundsBounds: lngOldBoundsBounds })
  return isOutOfLatBoundsBounds || isOutOfLngBoundsBounds
}

// function isSomeNewBoundOutOfOldOuterAxisBounds ({ axis, newBounds, axisBoundsBounds }) {
//   const NE = newBounds._northEast[axis]
//   const SW = newBounds._southWest[axis]
//   if (NE > axisBoundsBounds.NEmax) return true
//   if (SW < axisBoundsBounds.SWmin) return true
//   return false
// }

// export function isOutOfOuterBounds ({ newBounds, oldBounds, positionChangeToleranceRatio = defaultPositionChangeToleranceRatio }) {
//   const latOldBoundsBounds = getOldBoundsAxisBounds({ axis: 'lat', oldBounds, positionChangeToleranceRatio })
//   const lngOldBoundsBounds = getOldBoundsAxisBounds({ axis: 'lng', oldBounds, positionChangeToleranceRatio })
//   const isOutOfLatBoundsBounds = isSomeNewBoundOutOfOldOuterAxisBounds({ axis: 'lat', newBounds, axisBoundsBounds: latOldBoundsBounds })
//   const isOutOfLngBoundsBounds = isSomeNewBoundOutOfOldOuterAxisBounds({ axis: 'lng', newBounds, axisBoundsBounds: lngOldBoundsBounds })
//   return isOutOfLatBoundsBounds || isOutOfLngBoundsBounds
// }

export function getRadius ({ bounds }) {
  const { acos, sin, cos, PI } = Math
  const lat1 = bounds._northEast.lat * PI / 180
  const lat2 = bounds._southWest.lat * PI / 180
  const lng1 = bounds._northEast.lng * PI / 180
  const lng2 = bounds._southWest.lng * PI / 180
  const angularDistance = acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lng1 - lng2))
  const radius = angularDistance * earthRadius / 2
  return radius
}
