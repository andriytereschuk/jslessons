function Lab() {
  var self = this;

  var fLabMatrix = [],
      fIsUseRightHand,
      fCellCheckFunc;

  function _constructor() {
    self.findPath = findPath;
    self.stepCheck = stepCheck;
  }

  function cellCheck(aRowIndex, aColIndex) {
    return !!fLabMatrix[aRowIndex][aColIndex];
  }

  function findPath(aLabMatrix, aStartRowIndex, aStartColIndex, aIsUseRightHand, aCellCheckFunc) {
    fLabMatrix = aLabMatrix;
    fIsUseRightHand = aIsUseRightHand;

    var lStepRow = 0,
        lStepCol = 0;

    if (aStartRowIndex === 0) {
      lStepRow = 1;
      lStepCol = 0;
    } else
    if (aStartRowIndex === fLabMatrix.length - 1) {
      lStepRow = -1;
      lStepCol = 0;
    } else
    if (aStartColIndex === 0) {
      lStepRow = 0;
      lStepCol = 1;
    } else
    if (aStartColIndex === fLabMatrix[0].length - 1) {
      lStepRow = 0;
      lStepCol = -1;
    } else {
      alert('Bad start position');
      return false;
    }

    if (aCellCheckFunc) {
      fCellCheckFunc = aCellCheckFunc;
    } else {
      fCellCheckFunc = cellCheck;
    }

    return self.stepCheck(aStartRowIndex, aStartColIndex, lStepRow, lStepCol, true);
  }

  function stepCheck(aRowIndex, aColIndex, aStepRow, aStepCol, aIsFirstStep) {
    function lStepCheckRight() {
      var lStepRow = Number(!aStepRow) * aStepCol,
          lStepCol = Number(!aStepCol) * (-aStepRow),
          lRowIndex = aRowIndex + lStepRow,
          lColIndex = aColIndex + lStepCol;

      return self.stepCheck(lRowIndex, lColIndex, lStepRow, lStepCol);
    }

    function lStepCheckLeft() {
      var lStepRow = Number(!aStepRow) * (-aStepCol),
          lStepCol = Number(!aStepCol) * aStepRow,
          lRowIndex = aRowIndex + lStepRow,
          lColIndex = aColIndex + lStepCol;

      return self.stepCheck(lRowIndex, lColIndex, lStepRow, lStepCol);
    }

    function lStepCheckForward() {
      var lRowIndex = aRowIndex + aStepRow,
          lColIndex = aColIndex + aStepCol;

      return self.stepCheck(lRowIndex, lColIndex, aStepRow, aStepCol);
    }

    var lRow = fLabMatrix[aRowIndex];
    if (!lRow) {
      return false;
    }

    var lResult = [[aRowIndex, aColIndex]];

    if (fCellCheckFunc(aRowIndex, aColIndex)) {
      if (!aIsFirstStep) {
        if (
          (aRowIndex === 0) ||
          (aRowIndex === fLabMatrix.length - 1) ||
          (aColIndex === 0) ||
          (aColIndex === lRow.length - 1)
        ) {
          return lResult;
        }
      }
    } else {
      return false;
    }

    if (fIsUseRightHand) {
      var lStepCheckRightResult = lStepCheckRight();
      if (lStepCheckRightResult) {
        return lResult.concat(lStepCheckRightResult);
      }
    } else {
      var lStepCheckLeftResult = lStepCheckLeft();
      if (lStepCheckLeftResult) {
        return lResult.concat(lStepCheckLeftResult);
      }
    }

    var lStepCheckForwardResult = lStepCheckForward();
    if (lStepCheckForwardResult) {
      return lResult.concat(lStepCheckForwardResult);
    }

    if (fIsUseRightHand) {
      var lStepCheckLeftResult = lStepCheckLeft();
      if (lStepCheckLeftResult) {
        return lResult.concat(lStepCheckLeftResult);
      }
    } else {
      var lStepCheckRightResult = lStepCheckRight();
      if (lStepCheckRightResult) {
        return lResult.concat(lStepCheckRightResult);
      }
    }

    return false;
  }

  _constructor();
  return self;
}

function LabWithVizul(aDomElement) {
  var self = new Lab();

  var fLabMatrix,
      fLabAsHTML,
      fWeight = 0;

  // overrides
  var fFindPath__parent = self.findPath;
  var fStepCheck__parent = self.stepCheck;

  function _constructor() {
    self.findPath = findPath;
    self.stepCheck = stepCheck;
  }

  function findPath(aLabMatrix, aStartRowIndex, aStartColIndex, aIsUseRightHand) {
    fLabMatrix = aLabMatrix;
    fLabAsHTML = labToHTML(aLabMatrix);
    fWeight = 0;

    var lPath = fFindPath__parent(aLabMatrix, aStartRowIndex, aStartColIndex,
      aIsUseRightHand);

    return {
      weight: fWeight,
      path: lPath
    };
  }

  function labToHTML(aLabMatrix) {
    var lResult = [];

    aDomElement.innerHTML = '';
    aLabMatrix.forEach(function(aRow, aIndex) {
      var lRow = [];
      lResult.push(lRow);

      aRow.forEach(function(aCol, aIndex) {
        var lCellHE = document.createElement('div');
        lCellHE.className = 'cell';
        lCellHE.innerHTML = aCol;

        lCellHE.style.width = (100 / aRow.length) + '%';
        lCellHE.style.height = (100 / aLabMatrix.length) + '%';

        aDomElement.appendChild(lCellHE);

        lRow.push(lCellHE);
      });
    });

    return lResult;
  }

  function stepCheck(aRowIndex, aColIndex, aStepRow, aStepCol, aIsFirstStep) {
    var lStepCheckResult = fStepCheck__parent(aRowIndex, aColIndex, aStepRow,
      aStepCol, aIsFirstStep);

    fLabAsHTML[aRowIndex][aColIndex].className +=
      lStepCheckResult ? ' good' : ' bad';
    fWeight += lStepCheckResult ? fLabMatrix[aRowIndex][aColIndex] : 0;

    return lStepCheckResult;
  }

  _constructor();
  return self;
}