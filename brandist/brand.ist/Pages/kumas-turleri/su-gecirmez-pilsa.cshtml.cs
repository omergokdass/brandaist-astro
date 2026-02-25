using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Mail;

namespace brand.ist.Pages.kumas_turleri
{
    public class su_gecirmez_pilsaModel : PageModel
    {
        public void OnGet()
        {
        }
        public bool IsSendMail { get; set; } = false;
        public IActionResult OnPost(string PHONE, string FULLNAME, string EMAIL, string MESSAGE, string PAGE)
        {



            if (string.IsNullOrEmpty(FULLNAME) || string.IsNullOrEmpty(PHONE) || string.IsNullOrEmpty(EMAIL) || string.IsNullOrEmpty(MESSAGE) || string.IsNullOrEmpty(PAGE))
            {
                IsSendMail = false;
            }

            try
            {
                var messageHtml = $@"""<div id=':2i' class='ii gt' jslog='20277; u014N:xr6bB; 4:W251bGwsbnVsbCxbXV0.'>
             <div id=':2h' class='a3s aiL msg5188496127840509707'>
               <u></u>
               <div style='
                   height: 100% !important;
                   margin: 0 !important;
                   padding: 0 !important;
                   width: 100% !important;
                   min-width: 100%;
                   background-color: #d1deec;
                 '>
                 <u></u>
                 <u></u>
                 <table role='presentation' align='center' width='100%' cellspacing='0' cellpadding='0' border='0'>
                   <tbody>
                     <tr>
                       <td style='
                           font-size: 0;
                           text-align: center;
                           line-height: 100%;
                           background-color: #d1deec;
                           padding-top: 64px;
                           padding-bottom: 64px;
                           padding-left: 16px;
                           padding-right: 16px;
                         '>
                         <table role='presentation' align='center' width='100%' cellspacing='0' cellpadding='0' border='0' style='max-width: 800px; margin: 0 auto'>
                           <tbody>
                             <tr>
                               <td style='
                                   font-size: 0;
                                   text-align: center;
                                   background-color: #ffffff;
                                   border-top: 4px solid #2376dc;
                                   border-radius: 4px;
                                   padding-top: 32px;
                                   padding-bottom: 32px;
                                   padding-left: 16px;
                                   padding-right: 16px;
                                 '>
                                 <div style='
                                     font-size: 0;
                                     text-align: center;
                                     max-width: 624px;
                                     margin: 0 auto;
                                   '>
                                   <div class='m_5188496127840509707col_1' style='
                                       vertical-align: top;
                                       display: inline-block;
                                       width: 100%;
                                       max-width: 208px;
                                     '>
                                     <table role='presentation' align='center' width='100%' cellspacing='0' cellpadding='0' border='0' style='vertical-align: top'>
                                       <tbody>
                                         <tr>
                                           <td class='m_5188496127840509707column_cell m_5188496127840509707mobile_center' style='
                                               vertical-align: top;
                                               color: #2376dc;
                                               text-align: left;
                                               padding-top: 8px;
                                               padding-bottom: 8px;
                                               padding-left: 16px;
                                               padding-right: 16px;
                                             '>
                                             <p class='m_5188496127840509707img_inline' style='
                                                 color: inherit;
                                                 font-family: Arial, Helvetica, sans-serif;
                                                 margin-top: 0px;
                                                 margin-bottom: 0px;
                                                 word-break: break-word;
                                                 font-size: 16px;
                                                 line-height: 100%;
                                                 clear: both;
                                               '>
                                               
                                             </p>
                                           </td>
                                         </tr>
                                       </tbody>
                                     </table>
                                   </div>
                                   <div class='m_5188496127840509707col_3' style='
                                       vertical-align: top;
                                       display: inline-block;
                                       width: 100%;
                                       max-width: 416px;
                                     '>
                                     <table role='presentation' align='center' width='100%' cellspacing='0' cellpadding='0' border='0' style='vertical-align: top'>
                                       <tbody>
                                         <tr>
                                           <td class='m_5188496127840509707column_cell m_5188496127840509707mobile_center' style='
                                               vertical-align: top;
                                               text-align: right;
                                               padding-top: 8px;
                                               padding-bottom: 8px;
                                               padding-left: 16px;
                                               padding-right: 16px;
                                             '>
                                             <u></u>
                                             <p style='
                                                 color: #959ba0;
                                                 font-family: Arial, Helvetica, sans-serif;
                                                 margin-top: 0px;
                                                 margin-bottom: 0px;
                                                 word-break: break-word;
                                                 font-size: 16px;
                                                 line-height: 26px;
                                               '>
                                              
                                             </p>
                                             <u></u>
                                           </td>
                                         </tr>
                                       </tbody>
                                     </table>
                                   </div>
                                 </div>
                                 <div style='
                                     font-size: 0;
                                     text-align: center;
                                     max-width: 624px;
                                     margin: 0 auto;
                                   '>
                                   <div class='m_5188496127840509707col_3' style='
                                       vertical-align: top;
                                       display: inline-block;
                                       width: 100%;
                                       max-width: 416px;
                                     '>
                                     <table role='presentation' align='center' width='100%' cellspacing='0' cellpadding='0' border='0' style='vertical-align: top'>
                                       <tbody>
                                         <tr>
                                           <td class='m_5188496127840509707column_cell' height='32' style='
                                               vertical-align: top;
                                               border-bottom: 1px solid #dee0e1;
                                             '> &nbsp; </td>
                                         </tr>
                                       </tbody>
                                     </table>
                                   </div>
                                 </div>
                                 <div style='
                                     font-size: 0;
                                     text-align: center;
                                     max-width: 624px;
                                     margin: 0 auto;
                                   '>
                                   <table role='presentation' align='center' width='100%' cellspacing='0' cellpadding='0' border='0' style='vertical-align: top'>
                                     <tbody>
                                       <tr>
                                         <td class='m_5188496127840509707column_cell' style='
                                             vertical-align: top;
                                             color: #333333;
                                             text-align: center;
                                             padding-top: 32px;
                                             padding-bottom: 32px;
                                             padding-left: 16px;
                                             padding-right: 16px;
                                           '>
                                           <table class='m_5188496127840509707column_inline' role='presentation' align='center' cellspacing='0' cellpadding='0' border='0' style='
                                               vertical-align: top;
                                               width: auto;
                                               margin: 0 auto;
                                               clear: both;
                                             '>
                                             <tbody></tbody>
                                           </table>
                                           <table style='vertical-align: top' border='0' cellspacing='0' cellpadding='0' align='center'>
                                             <tbody>
                                               <tr>
                                                 <td class='m_5188496127840509707column_cell' style='
                                                     vertical-align: top;
                                                     color: #333333;
                                                     text-align: center;
                                                     padding-top: 32px;
                                                     padding-bottom: 32px;
                                                     padding-left: 16px;
                                                     padding-right: 16px;
                                                   '>
                                                   <table class='m_5188496127840509707column_inline' border='0' cellspacing='0' cellpadding='0' align='center' style='
                                                       vertical-align: top;
                                                       width: auto;
                                                       margin: 0 auto;
                                                       clear: both;
                                                     '>
                                                     <tbody>
                                                       <tr>
                                                         <td class='m_5188496127840509707column_cell' style='
                                                             vertical-align: top;
                                                             color: #ffffff;
                                                             border-radius: 50%;
                                                             text-align: center;
                                                             padding-top: 16px;
                                                             padding-bottom: 16px;
                                                             padding-left: 16px;
                                                             padding-right: 16px;
                                                           '>
                                                           <p style='
                                                               color: inherit;
                                                               font-family: Arial,
                                                                 Helvetica, sans-serif;
                                                               margin-top: 0px;
                                                               margin-bottom: 0px;
                                                               word-break: break-word;
                                                               font-size: 0 !important;
                                                               line-height: 100%;
                                                               clear: both;
                                                             '>
                                                             <img style='
                                                                 max-width: 150px;
                                                                 border: 0;
                                                                 height: auto;
                                                                 line-height: 100%;
                                                                 outline: none;
                                                                 text-decoration: none;
                                                                 display: block;
                                                                 width: 100%;
                                                                 margin: 0px auto;
                                                               ' src='https://www.pinclipart.com/picdir/big/572-5720235_message-clipart.png' alt='' class='CToWUd a6T' tabindex='0' />
                                                           <div class='a6S' dir='ltr' style='
                                                                 opacity: 0.01;
                                                                 left: 779px;
                                                                 top: 374.859px;
                                                               '>
                                                             <div id=':2z' class='T-I J-J5-Ji aQv T-I-ax7 L3 a5q' role='button' tabindex='0' aria-label=' adlý eki indir' data-tooltip-class='a1V' data-tooltip='Ýndir'>
                                                               <div class='akn'>
                                                                 <div class='aSK J-J5-Ji aYr'></div>
                                                               </div>
                                                             </div>
                                                           </div>
                                                           </p>
                                                         </td>
                                                       </tr>
                                                     </tbody>
                                                   </table>
                                                   <p style='
                                                       color: inherit;
                                                       font-family: Arial, Helvetica,
                                                         sans-serif;
                                                       margin-top: 0px;
                                                       margin-bottom: 0px;
                                                       word-break: break-word;
                                                       font-size: 16px;
                                                       line-height: 26px;
                                                     '> Yeni <strong style='font-weight: bold'>Sipariþiniz </strong>var; </p>
                                                   
                                                   <p style='
                                                       color: inherit;
                                                       font-family: Arial, Helvetica,
                                                         sans-serif;
                                                       margin-top: 0px;
                                                       margin-bottom: 0px;
                                                       word-break: break-word;
                                                       font-size: 16px;
                                                       line-height: 26px;
                                                     '>
                                                     <br />
                                                     <strong style='font-weight: bold'>Sayfa : </strong>{PAGE}<br />
                                                     <strong style='font-weight: bold'>Ad Soyad : </strong>{FULLNAME}<br />
                                                     <strong style='font-weight: bold'>Telefon : </strong>{PHONE}<br />
                                                     <strong style='font-weight: bold'>E-mail : </strong>{EMAIL}<br />
                                                     <strong style='font-weight: bold'>Mesaj : </strong>{MESSAGE}<br />
                      
                                                     <br />
                                                   </p>
                                                 </td>
                                               </tr>
                                             </tbody>
                                           </table>
                                         </td>
                                       </tr>
                                     </tbody>
                                   </table>
                                 </div>
                               </td>
                             </tr>
                             <tr>
                               <td style='font-size: 0; text-align: center'>
                                 <div style='
                                     font-size: 0;
                                     text-align: center;
                                     max-width: 624px;
                                     margin: 0 auto;
                                   '>
                                   <table role='presentation' align='center' width='100%' cellspacing='0' cellpadding='0' border='0' style='vertical-align: top'>
                                     <tbody>
                                       <tr>
                                         <td class='m_5188496127840509707column_cell' style='
                                             vertical-align: top;
                                             color: #959ba0;
                                             text-align: center;
                                             padding-top: 32px;
                                             padding-bottom: 32px;
                                             padding-left: 16px;
                                             padding-right: 16px;
                                           '>
                                           <u></u>
                                           <p style='
                                               color: inherit;
                                               font-family: Arial, Helvetica, sans-serif;
                                               margin-top: 0px;
                                               margin-bottom: 8px;
                                               word-break: break-word;
                                               font-size: 16px;
                                               line-height: 26px;
                                             '>Yeni Sipariþ </p>
                                           <u></u>
                                         </td>
                                       </tr>
                                     </tbody>
                                   </table>
                                 </div>
                               </td>
                             </tr>
                           </tbody>
                         </table>
                       </td>
                     </tr>
                   </tbody>
                 </table>
                 <u></u>
                 <u></u>
                 <div class='yj6qo'></div>
                 <div class='adL'></div>
               </div>
               <div class='adL'></div>
             </div>
           </div>";

                MailMessage mail = new MailMessage();
                mail.To.Add("tente.ist@gmail.com");
                mail.From = new MailAddress("tente.ist@gmail.com");
                mail.Subject = "Yeni Sipariþiniz Var";
                mail.Body = messageHtml;
                mail.IsBodyHtml = true;

                //SmtpClient smtp = new SmtpClient();
                //smtp.Port = 587;
                //smtp.EnableSsl = true;
                //smtp.UseDefaultCredentials = false;
                //smtp.Host = "smtp.gmail.com";
                //smtp.Credentials = new System.Net.NetworkCredential("akpaajans19@gmail.com", "xakdyxoctxjqfaed");
                //smtp.Send(mail);

                SmtpClient client = new SmtpClient
                {
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential("tente.ist@gmail.com", "zhvpsebtaabsfznf"),
                    Port = 587,    // You can use Port 25 if 587 is blocked (mine is!)
                    Host = "smtp.gmail.com",       // smtp.office365.com,
                    EnableSsl = true
                };

                client.Send(mail);

                IsSendMail = true;
            }
            catch (Exception ex)
            {
                IsSendMail = false;
            }

            return Page();
        }
    }
}
