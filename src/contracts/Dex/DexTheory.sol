/**
    Decentralised Exchanges dont use the traditional orderbook model used in CeFi
    Because it would be :
        *Slow
        *Gas Expensive
        *Inefficient
        *Not scalable

    Instead they use that is called --Market Makers--
    They work with liquidity pools distributed in asset pears
    They use a formula to mantain a quity betweeen the pairs where : 

        {
            QA * QB = k
            QA * PB = QB * PA

        }

        [
            QA = Quantity of asset A
            PA = Price of asset A
            QB = Quantity of asset B
            PB = Price of asset B
            k = constant
        ]

-----------------------------------------------------------------------------------------------------------------

    Example :
    Having a pool with :{
                1,000 u. asset A=> 1$ each => value : 1000$
                1,000 u. asset B=> 1$ each => value : 1000$
                }

    a) If we want 50 of asset B how much of asset A must we pay?
    
        1){                                  2){
            QA * QB = k                           1000 * 1000 = 1,000,000
            QA * (1,000-50) = k                   QA * (950) = 1,000,000
        }                                     }
        
        3){
                   1,000,000
            QA = ------------  = 1.052
                   950
        }
       
       ANSWER = WE MUST PAY 1.052(A) TO GET 1  (B)


    b) Now , what would happen if (B)'s price raised to 1.5$ ? 

        1)                                      2){
            {k = 1,000,000 }                        QA = PB * QB
                                                    PB * QB * QB = 1,000,000
                                                      [k = 1,000,000]
                                                  }
        


        3){                                     4){
            1.5 * QB * QB = 1,000,000                        1,000,000 
          }                                          QB^2 = ------------  => QB = Sqr(666666.66) => QB = 816.49
                                                               1.5
                                                   }
        
        ANSWER = NOW THERE SHOULD BE 816.49 (A) AND 1224.744 (B)

------------------------------------------------------------------------------------------------------------------

 */


