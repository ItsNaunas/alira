// Conditional question logic based on business stage

import type { IndustryType } from './business-case-methodology'
import { getProblemPatterns } from './industry-questions'

export type BusinessStage = 'idea' | 'early' | 'growing' | 'established' | undefined

interface ConditionalQuestion {
  label: string
  placeholder: string
  hint: string
  hintIcon: string
}

export function getChallengesQuestion(
  stage: BusinessStage,
  industry?: IndustryType
): ConditionalQuestion {
  switch (stage) {
    case 'idea':
      const baseHint = 'Common concerns: Market validation, finding customers, funding, competition, or defining your unique value'
      const industryHint = industry ? ` Industry-specific: ${getProblemPatterns(industry).slice(0, 2).join(', ')}` : ''
      return {
        label: 'What concerns you most about starting this business?',
        placeholder: 'What risks or obstacles do you see ahead?',
        hint: baseHint + industryHint,
        hintIcon: '💭'
      }
    case 'early': {
      const baseHint = 'Common challenges: Lack of systems, unclear processes, manual work, limited resources, or inconsistent messaging'
      const industryHint = industry ? ` Industry-specific: ${getProblemPatterns(industry).slice(0, 2).join(', ')}` : ''
      return {
        label: 'What are your biggest operational challenges right now?',
        placeholder: 'What\'s slowing you down or preventing growth?',
        hint: baseHint + industryHint,
        hintIcon: '⚠️'
      }
    }
    case 'growing': {
      const baseHint = 'Common bottlenecks: Manual processes, scattered data, team alignment, customer acquisition costs, or scalability issues'
      const industryHint = industry ? ` Industry-specific: ${getProblemPatterns(industry).slice(0, 2).join(', ')}` : ''
      return {
        label: 'What bottlenecks are limiting your growth?',
        placeholder: 'What systems or processes are breaking as you scale?',
        hint: baseHint + industryHint,
        hintIcon: '🚧'
      }
    }
    case 'established': {
      const baseHint = 'Common inefficiencies: Redundant processes, outdated systems, lack of automation, poor data visibility, or resource waste'
      const industryHint = industry ? ` Industry-specific: ${getProblemPatterns(industry).slice(0, 2).join(', ')}` : ''
      return {
        label: 'What operational inefficiencies do you want to eliminate?',
        placeholder: 'Where are you losing time or money unnecessarily?',
        hint: baseHint + industryHint,
        hintIcon: '⚡'
      }
    }
    default: {
      const baseHint = 'Common challenges: Unclear messaging, scattered customer data, manual processes, poor website conversion, or lack of automation'
      const industryHint = industry ? ` Industry-specific: ${getProblemPatterns(industry).slice(0, 2).join(', ')}` : ''
      return {
        label: 'What are your biggest operational challenges right now?',
        placeholder: 'What\'s slowing you down or preventing growth?',
        hint: baseHint + industryHint,
        hintIcon: '⚠️'
      }
    }
  }
}

export function getGoalsQuestion(
  stage: BusinessStage,
  industry?: IndustryType
): ConditionalQuestion {
  switch (stage) {
    case 'idea':
      return {
        label: 'What do you want to validate or achieve in the next 3-6 months?',
        placeholder: 'What would prove this idea is worth pursuing?',
        hint: 'Example goals: Validate market demand, build an MVP, get first 10 customers, or clarify your positioning',
        hintIcon: '🔍'
      }
    case 'early':
      return {
        label: 'What milestones do you want to hit in the next 3-6 months?',
        placeholder: 'What specific outcomes would make this period a success?',
        hint: 'Example goals: Reach 100 customers, automate key processes, establish brand identity, or improve conversion rates by 25%',
        hintIcon: '🎯'
      }
    case 'growing':
      return {
        label: 'What growth targets do you want to achieve in the next 3-6 months?',
        placeholder: 'What metrics or outcomes would signal successful scaling?',
        hint: 'Example goals: Double revenue, reduce customer acquisition cost by 30%, expand to new markets, or build a repeatable sales process',
        hintIcon: '📈'
      }
    case 'established':
      return {
        label: 'What optimization goals do you want to achieve in the next 3-6 months?',
        placeholder: 'Where do you want to see improvements or efficiencies?',
        hint: 'Example goals: Increase profit margins by 20%, reduce operational costs, streamline workflows, or enhance customer lifetime value',
        hintIcon: '🎯'
      }
    default:
      return {
        label: 'What do you want to achieve in the next 3-6 months?',
        placeholder: 'What specific outcomes do you want to see?',
        hint: 'Example goals: Increase conversion rates by 25%, automate lead follow-up, clarify brand positioning, or streamline customer onboarding',
        hintIcon: '🎯'
      }
  }
}

