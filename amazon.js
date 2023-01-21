
    //include the Puppeteer
    const puppeteer             =       require('puppeteer');

    //File system
    const fs                    =       require('fs');

    //Page URL
    const page                  =       'https://www.amazon.com/gp/browse.html?node=541966&ref_=nav_em__basedevices_0_2_16_2';

    //Items array
    let items                   =       [];

    //Async
    (async () =>
    {

        //launch browser
        const browser           =       await puppeteer.launch({
                                                                    headless: false,
                                                                    defaultViewport: false,
                                                                    userDataDir:    "./tmp",
                                                                });

        const page              =       await browser.newPage();
        await page.goto('https://www.amazon.com/b?node=11036541&ref=lp_172456_nr_n_2',
                        {
                            waitUntil: 'load',
                            timeout: 0
                        });


        //Product handler
        const productHandles    =        await page.$$('div.s-main-slot.s-result-list.s-search-results.sg-row  > .s-result-item');


        //Loop all products
        for ( const product of productHandles )
        {
            try{

                const title         =       await page.evaluate(
                                                                    (product) =>
                                                                    {
                                                                        return product.querySelector('h2 > a > span').innerHTML;
                                                                    },
                                                                    product

                                                                );
                //items.push(title);

                //Add to CSV
                fs.appendFile('amazon.csv', `${title}\n`, function (err) {
                    if (err) throw err;
                    console.log("Saved");
                })

            }catch (e) {

            }
        }

        //console.log(items);

        await browser.close();
    })();