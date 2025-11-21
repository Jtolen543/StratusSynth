import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "What is YourApp and how does it work?",
    answer: "YourApp is a modern platform designed to help you build, scale, and grow your business with powerful tools and intuitive design. It provides a comprehensive suite of features including project management, analytics, collaboration tools, and more to streamline your workflow."
  },
  {
    question: "How do I get started with YourApp?",
    answer: "Getting started is easy! Simply sign up for an account, choose your plan, and follow our onboarding guide. We provide step-by-step tutorials and documentation to help you set up your first project in minutes."
  },
  {
    question: "What pricing plans do you offer?",
    answer: "We offer flexible pricing plans to suit different needs: Free tier for individuals, Pro for small teams, and Enterprise for large organizations. Each plan includes different features and usage limits. You can upgrade or downgrade at any time."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a 14-day free trial for all paid plans. No credit card required to start your trial. You can explore all features and decide if YourApp is right for your needs before committing to a paid plan."
  },
  {
    question: "How secure is my data?",
    answer: "Security is our top priority. We use enterprise-grade encryption, regular security audits, and comply with industry standards like SOC 2 and GDPR. Your data is encrypted both in transit and at rest, and we never share your information with third parties."
  },
  {
    question: "Can I integrate YourApp with other tools?",
    answer: "Absolutely! YourApp offers extensive integration capabilities through our API and pre-built connectors. We integrate with popular tools like Slack, Google Workspace, Microsoft 365, and many others. You can also build custom integrations using our API."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide comprehensive support through multiple channels: email support for all users, live chat for Pro and Enterprise users, and dedicated account managers for Enterprise customers. We also maintain extensive documentation and a community forum."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees, and you'll continue to have access to your plan features until the end of your current billing period."
  },
  {
    question: "Do you offer training or onboarding assistance?",
    answer: "Yes! We provide comprehensive onboarding assistance including live training sessions, video tutorials, and documentation. Enterprise customers receive dedicated onboarding support and custom training sessions for their teams."
  },
  {
    question: "How often do you release updates?",
    answer: "We release regular updates with new features, improvements, and bug fixes. Major feature releases typically happen monthly, with smaller updates and fixes released weekly. All updates are included in your subscription at no extra cost."
  }
]

export function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <HelpCircle className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about YourApp. Can't find what you're looking for? 
            <span className="text-primary"> Contact our support team</span>.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible>
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 bg-card"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-semibold pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          className="bg-muted/50 rounded-2xl p-8 text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you get the most out of YourApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Contact Support
            </Button>
            <Button variant="outline">
              Browse Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
