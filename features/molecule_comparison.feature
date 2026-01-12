Feature: Molecule ADMET property comparison

  Scenario: Compare parent and child molecule properties
    Given I evaluate the parent molecule with SMILES "CC/C(=C(\C1=CC=CC=C1)/C2=CC=C(C=C2)OCCN(C)C)/C3=CC=CC=C3"
    And I evaluate the following child molecules:
      | smiles |
      | OCC(c1cccnc1)C(c1ccc(OCCN2CCOCC2)cc1)c1cccnc1 |
      | CN(C)CCOc1ccc(C(=C(CC#N)c2ccccc2)c2ccccc2S)cc1S |
      | CC/C(=C(c1ccc(O)cc1)c1ccc(OCCN(C)C)cc1)c1cc(OC)ccc1CO |
      | CNC(=O)CC/C(=C(\c1ccccc1)c1ccc(OCCN2CCOCC2)cc1)c1ccccc1 |
      | CC/C(=C(\c1ccc(F)cc1)c1ccc(OCCNC)cc1)                   |
    When I compare the ADMET properties
    Then I generate an Excel score report